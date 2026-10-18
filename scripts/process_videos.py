"""
Chroma-key pipeline for 5 Fanta can videos.
- Extracts 41 evenly-spaced frames per video via ffmpeg
- Removes green-screen background with HSV chroma key (PIL + numpy)
- Crops to can bounding box, pads/resizes to OUTPUT_W x OUTPUT_H
- Exports to public/can-frames/<flavor>/ as frame_000.webp ... frame_040.webp
- Prints dominant can color per flavor (for theme generation)
"""

import os
import subprocess
import tempfile
import shutil
import json
import numpy as np
from PIL import Image

# ── Config ────────────────────────────────────────────────────────────────────
ASSETS = r"D:\fanta\assets"
OUT_ROOT = r"D:\fanta\public\can-frames"
TARGET_FRAMES = 41
OUTPUT_W = 680
OUTPUT_H = 1440
WEBP_QUALITY = 82

FLAVORS = {
    "green":  "green fanta.mp4",
    "blue":   "blue fanta.mp4",
    "red":    "red fanta.mp4",
    "purple": "purple fanta.mp4",
    "mixed":  "mixed colour fanta.mp4",
}

# HSV chroma key params (hue in 0-360°)
HUE_LO      = 85    # lower bound of green hue
HUE_HI      = 165   # upper bound of green hue
SAT_MIN     = 0.30  # minimum saturation to count as background
VAL_MIN     = 0.12  # minimum value (brightness)
FEATHER_H   = 18    # degrees of feather on hue edges
FEATHER_S   = 0.12  # saturation feather width

# ── Chroma key ────────────────────────────────────────────────────────────────
def rgb_to_hsv(arr):
    """arr: float32 H×W×3 in [0,1]. Returns H×W×3 (h 0-360, s 0-1, v 0-1)."""
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    v = maxc
    diff = maxc - minc
    s = np.where(maxc > 1e-6, diff / maxc, 0.0)

    rc = np.where(diff > 1e-6, (maxc - r) / diff, 0.0)
    gc = np.where(diff > 1e-6, (maxc - g) / diff, 0.0)
    bc = np.where(diff > 1e-6, (maxc - b) / diff, 0.0)

    h = np.where(maxc == r, bc - gc,
        np.where(maxc == g, 2.0 + rc - bc,
                             4.0 + gc - rc))
    h = (h / 6.0) % 1.0
    return np.stack([h * 360.0, s, v], axis=-1)


def apply_chroma_key(pil_img):
    """Return RGBA PIL image with green background removed."""
    rgb = np.array(pil_img.convert("RGB"), dtype=np.float32) / 255.0
    hsv = rgb_to_hsv(rgb)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]

    # Softness factors (0=fully keyed, 1=fully opaque)
    hue_center = (HUE_LO + HUE_HI) / 2.0
    hue_dist   = np.abs(h - hue_center)
    hue_half   = (HUE_HI - HUE_LO) / 2.0

    # 1 outside key zone → 0 at center
    hue_factor = np.clip((hue_dist - (hue_half - FEATHER_H)) / FEATHER_H, 0.0, 1.0)
    sat_factor = np.clip((s - SAT_MIN) / FEATHER_S, 0.0, 1.0)

    # Only key pixels that are inside hue range, high-sat, bright enough
    is_key = (hue_dist < hue_half) & (s > SAT_MIN) & (v > VAL_MIN)

    # Alpha: 1 = fully opaque (not keyed), 0 = fully transparent (keyed)
    alpha_f = np.where(is_key, hue_factor * (1.0 - sat_factor * (1.0 - hue_factor)), 1.0)
    alpha_f = np.clip(alpha_f, 0.0, 1.0)

    alpha_u8 = (alpha_f * 255).astype(np.uint8)
    rgb_u8   = (rgb * 255).astype(np.uint8)
    rgba     = np.dstack([rgb_u8, alpha_u8])
    return Image.fromarray(rgba, "RGBA")


def crop_to_content(pil_rgba, pad_pct=0.04):
    """Crop to non-transparent bounding box + padding."""
    alpha = np.array(pil_rgba.split()[3])
    rows  = np.any(alpha > 10, axis=1)
    cols  = np.any(alpha > 10, axis=0)
    if not rows.any():
        return pil_rgba  # fully transparent — return as-is
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    h, w = alpha.shape
    pad_r = int((rmax - rmin) * pad_pct)
    pad_c = int((cmax - cmin) * pad_pct)
    rmin = max(0, rmin - pad_r)
    rmax = min(h - 1, rmax + pad_r)
    cmin = max(0, cmin - pad_c)
    cmax = min(w - 1, cmax + pad_c)
    return pil_rgba.crop((cmin, rmin, cmax + 1, rmax + 1))


def fit_to_canvas(pil_rgba, out_w, out_h):
    """Scale image to fit within out_w x out_h, centre on transparent canvas."""
    iw, ih = pil_rgba.size
    scale = min(out_w / iw, out_h / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    resized = pil_rgba.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", (out_w, out_h), (0, 0, 0, 0))
    ox = (out_w - nw) // 2
    oy = (out_h - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def dominant_can_color(pil_rgba):
    """Return median RGB of opaque can pixels (for theme generation)."""
    arr   = np.array(pil_rgba)
    mask  = arr[..., 3] > 180
    if not mask.any():
        return (128, 128, 128)
    pixels = arr[mask][..., :3]
    return tuple(np.median(pixels, axis=0).astype(int).tolist())


# ── Frame extraction ──────────────────────────────────────────────────────────
def extract_frames(video_path, out_dir, n_frames):
    """Use ffmpeg to extract n_frames evenly from video into out_dir as PNG."""
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json",
         "-show_streams", video_path],
        capture_output=True, text=True
    )
    info     = json.loads(result.stdout)
    vs       = next(s for s in info["streams"] if s["codec_type"] == "video")
    duration = float(vs["duration"])

    os.makedirs(out_dir, exist_ok=True)
    # Select n_frames evenly (avoid very first/last frame which may be black)
    for i in range(n_frames):
        t = 0.05 * duration + (0.90 * duration) * i / max(n_frames - 1, 1)
        out_path = os.path.join(out_dir, f"raw_{i:03d}.png")
        subprocess.run(
            ["ffmpeg", "-ss", str(t), "-i", video_path,
             "-frames:v", "1", "-q:v", "1", out_path, "-y"],
            capture_output=True
        )
    print(f"  Extracted {n_frames} frames from {os.path.basename(video_path)}")


# ── Main pipeline ─────────────────────────────────────────────────────────────
theme_colors = {}

for flavor, filename in FLAVORS.items():
    video_path = os.path.join(ASSETS, filename)
    out_dir    = os.path.join(OUT_ROOT, flavor)
    os.makedirs(out_dir, exist_ok=True)

    print(f"\n== {flavor.upper()} =================================")

    # 1. Extract raw frames into a temp folder
    tmp_dir = tempfile.mkdtemp(prefix=f"fanta_{flavor}_")
    try:
        extract_frames(video_path, tmp_dir, TARGET_FRAMES)

        can_colors = []
        for i in range(TARGET_FRAMES):
            raw_path = os.path.join(tmp_dir, f"raw_{i:03d}.png")
            if not os.path.exists(raw_path):
                print(f"  WARNING: missing raw frame {i}")
                continue

            # 2. Chroma key
            src  = Image.open(raw_path)
            rgba = apply_chroma_key(src)

            # 3. Crop + fit to standard canvas
            rgba = crop_to_content(rgba)
            rgba = fit_to_canvas(rgba, OUTPUT_W, OUTPUT_H)

            # 4. Collect can color (middle frames only)
            if 10 <= i <= 30:
                can_colors.append(dominant_can_color(rgba))

            # 5. Save as WebP
            out_path = os.path.join(out_dir, f"frame_{i:03d}.webp")
            rgba.save(out_path, "WEBP", quality=WEBP_QUALITY, lossless=False)

            if i % 10 == 0:
                print(f"  frame {i:03d} done")

        # 6. Dominant can color
        if can_colors:
            med = np.median(can_colors, axis=0).astype(int)
            hex_color = f"#{med[0]:02X}{med[1]:02X}{med[2]:02X}"
            theme_colors[flavor] = {"r": int(med[0]), "g": int(med[1]), "b": int(med[2]), "hex": hex_color}
            print(f"  Dominant can color: {hex_color}")

    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)

# ── Write theme colors to JSON ────────────────────────────────────────────────
json_path = os.path.join(OUT_ROOT, "themes.json")
with open(json_path, "w") as f:
    json.dump(theme_colors, f, indent=2)

print(f"\nDone! All flavors processed. Theme colors saved to {json_path}")
print(json.dumps(theme_colors, indent=2))
