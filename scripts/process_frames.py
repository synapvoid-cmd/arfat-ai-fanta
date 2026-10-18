"""
Process Fanta can frame sequences into consistent, centered WebP animations.

Strategy:
  1. Chroma-key the green-screen background (Euclidean RGB distance).
  2. Pool ALL opaque pixels from all 41 frames → find center of mass + tight bbox.
  3. Build one fixed crop window (same size for ALL flavors) centred on the can.
  4. Scale so the can fills ~FILL_PCT of the output canvas height.
  5. Apply the identical crop + scale to every frame → no flicker, no position jump.
"""

import os
import numpy as np
from PIL import Image

# ── Config ────────────────────────────────────────────────────────────────────
FRAMES_ROOT   = r"D:\fanta\assets\frames"
OUT_ROOT      = r"D:\fanta\public\can-frames"
TARGET_FRAMES = 41
OUTPUT_W      = 680
OUTPUT_H      = 1440
WEBP_QUALITY  = 85
FILL_PCT      = 0.82   # can fills this fraction of OUTPUT_H

BBOX_ALPHA_MIN = 100   # only count pixels with alpha >= this for bbox/centroid

# Per-folder chroma key tolerance.
# Non-green cans: high tolerance (85) catches bokeh/lighting variation
#   safely — their can colours are 140-250 RGB units from the green bg.
# Green can (03): tight tolerance (52) to protect the can's own green label.
FOLDER_CHROMA = {
    "01": (85, 24),   # red    — (tolerance, feather)
    "02": (80, 22),   # mixed  — has green stripe + water droplets; tolerate specks
    "03": (52, 16),   # green  — can colour too close to bg; tight key
    "04": (88, 24),   # purple — safe to be aggressive
    "05": (85, 24),   # blue   — safe to be aggressive
}

FOLDER_MAP = {
    "01": "red",
    "02": "mixed",
    "03": "green",
    "04": "purple",
    "05": "blue",
}

# ── Chroma key ────────────────────────────────────────────────────────────────
def sample_bg(arr):
    """Median RGB from four 30×30 corner patches + mid-edge strips."""
    h, w = arr.shape[:2]
    patches = np.vstack([arr[:30,:30].reshape(-1,3),   arr[:30,-30:].reshape(-1,3),
                         arr[-30:,:30].reshape(-1,3),  arr[-30:,-30:].reshape(-1,3),
                         arr[:30,  w//2-20:w//2+20].reshape(-1,3),
                         arr[-30:, w//2-20:w//2+20].reshape(-1,3)])
    return np.median(patches, axis=0)



def chroma_key(pil_img, bg_rgb, tol=85, feather=24):
    """
    Euclidean RGB distance chroma key.
    Higher tolerance catches background bokeh/lighting variation.
    A 3×3 median filter removes any remaining isolated single-pixel specks.
    """
    from PIL import ImageFilter
    arr   = np.array(pil_img.convert("RGB"), dtype=np.float32)
    diff  = np.sqrt(np.sum((arr - bg_rgb) ** 2, axis=2))
    alpha = np.clip((diff - tol) / feather, 0.0, 1.0)

    alpha_u8    = (alpha * 255).astype(np.uint8)
    alpha_clean = Image.fromarray(alpha_u8, "L").filter(ImageFilter.MedianFilter(3))
    alpha_u8    = np.array(alpha_clean)

    rgba = np.dstack([arr.astype(np.uint8), alpha_u8])
    return Image.fromarray(rgba, "RGBA")


# ── Geometry helpers ──────────────────────────────────────────────────────────
def opaque_coords(pil_rgba):
    """Arrays of (rows, cols) for pixels with alpha >= BBOX_ALPHA_MIN."""
    a = np.array(pil_rgba.split()[3])
    return np.where(a >= BBOX_ALPHA_MIN)  # returns (ys, xs)


def even_indices(total, n):
    return [round(i * (total - 1) / (n - 1)) for i in range(n)]


# ── Main ──────────────────────────────────────────────────────────────────────
for folder_num, flavor_id in FOLDER_MAP.items():
    src_dir = os.path.join(FRAMES_ROOT, folder_num)
    out_dir = os.path.join(OUT_ROOT, flavor_id)
    os.makedirs(out_dir, exist_ok=True)

    all_files = sorted(f for f in os.listdir(src_dir)
                       if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')))
    total = len(all_files)
    if total == 0:
        print(f"[{folder_num}] EMPTY — skipping"); continue

    first_arr = np.array(Image.open(os.path.join(src_dir, all_files[0])).convert("RGB"))
    src_h, src_w = first_arr.shape[:2]
    bg = sample_bg(first_arr)
    print(f"[{folder_num}] {flavor_id:8s}  {total} frames  {src_w}x{src_h}  bg=#{int(bg[0]):02X}{int(bg[1]):02X}{int(bg[2]):02X}")

    indices = even_indices(total, TARGET_FRAMES)

    # ── Pass 1: chroma-key + collect all opaque pixel coordinates ────────────
    tol, feather = FOLDER_CHROMA.get(folder_num, (80, 22))
    print(f"         pass 1: keying {TARGET_FRAMES} frames  (tol={tol}, feather={feather})...")
    keyed = []
    all_ys, all_xs = [], []
    for src_i in indices:
        rgba = chroma_key(Image.open(os.path.join(src_dir, all_files[src_i])), bg, tol=tol, feather=feather)
        keyed.append(rgba)
        ys, xs = opaque_coords(rgba)
        if len(ys):
            all_ys.append(ys); all_xs.append(xs)

    if not all_ys:
        print(f"         WARNING: no opaque pixels found — skipping"); continue

    pool_y = np.concatenate(all_ys)
    pool_x = np.concatenate(all_xs)

    # ── Centroid + tight bbox (1st–99th percentile to drop edge noise) ───────
    cy = float(np.percentile(pool_y, 50))   # median Y
    cx = float(np.percentile(pool_x, 50))   # median X
    can_top    = int(np.percentile(pool_y,  1))
    can_bottom = int(np.percentile(pool_y, 99))
    can_left   = int(np.percentile(pool_x,  1))
    can_right  = int(np.percentile(pool_x, 99))

    can_h_src  = can_bottom - can_top    # can height in source pixels
    can_w_src  = can_right  - can_left   # can width  in source pixels

    print(f"         centroid=({cx:.0f},{cy:.0f})  can_src={can_w_src}x{can_h_src}")

    # ── Fixed crop window centred on the can centroid ────────────────────────
    # Scale so can fills FILL_PCT of OUTPUT_H
    scale       = (FILL_PCT * OUTPUT_H) / can_h_src
    crop_h_src  = OUTPUT_H / scale          # how many source rows map to OUTPUT_H
    crop_w_src  = OUTPUT_W / scale          # how many source cols map to OUTPUT_W

    # Centre the crop on the can centroid
    crop_r0 = int(cy - crop_h_src / 2)
    crop_r1 = int(cy + crop_h_src / 2)
    crop_c0 = int(cx - crop_w_src / 2)
    crop_c1 = int(cx + crop_w_src / 2)

    # Clamp to source image bounds
    crop_r0 = max(0, crop_r0); crop_r1 = min(src_h, crop_r1)
    crop_c0 = max(0, crop_c0); crop_c1 = min(src_w, crop_c1)
    print(f"         crop=[{crop_c0},{crop_r0}]->[{crop_c1},{crop_r1}]  scale={scale:.3f}")

    # ── Pass 2: apply identical crop + resize to every frame ─────────────────
    print(f"         pass 2: saving...")
    for out_i, rgba in enumerate(keyed):
        cropped  = rgba.crop((crop_c0, crop_r0, crop_c1, crop_r1))
        # Resize crop to exact output dimensions (letterboxes if aspect differs)
        cw, ch = cropped.size
        s = min(OUTPUT_W / cw, OUTPUT_H / ch)
        nw, nh = int(cw * s), int(ch * s)
        resized = cropped.resize((nw, nh), Image.LANCZOS)
        canvas  = Image.new("RGBA", (OUTPUT_W, OUTPUT_H), (0, 0, 0, 0))
        ox = (OUTPUT_W - nw) // 2
        oy = (OUTPUT_H - nh) // 2
        canvas.paste(resized, (ox, oy), resized)
        canvas.save(os.path.join(out_dir, f"frame_{out_i:03d}.webp"),
                    "WEBP", quality=WEBP_QUALITY, lossless=False)

    print(f"         -> wrote {TARGET_FRAMES} frames to can-frames/{flavor_id}/")

print("\nDone.")
