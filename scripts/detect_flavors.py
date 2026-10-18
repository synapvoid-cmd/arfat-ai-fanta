"""
Detect which numbered folder corresponds to which Fanta flavor
by analysing the dominant non-background hue of a mid-sequence frame.
"""
import os
import numpy as np
from PIL import Image

FRAMES_ROOT = r"D:\fanta\assets\frames"

def detect_bg(arr):
    """Median colour from all four corner 30x30 patches."""
    h, w = arr.shape[:2]
    patches = np.vstack([
        arr[:30, :30].reshape(-1, 3),
        arr[:30, -30:].reshape(-1, 3),
        arr[-30:, :30].reshape(-1, 3),
        arr[-30:, -30:].reshape(-1, 3),
    ])
    return np.median(patches, axis=0)

def chroma_key_alpha(arr, bg, tol=55):
    """Simple Euclidean-distance chroma key. Returns alpha mask (0=keyed)."""
    diff = np.sqrt(np.sum((arr.astype(float) - bg) ** 2, axis=2))
    return (np.clip((diff - tol) / 20.0, 0, 1) * 255).astype(np.uint8)

def rgb_to_hue(arr_f):
    r, g, b = arr_f[...,0], arr_f[...,1], arr_f[...,2]
    maxc = np.maximum(np.maximum(r,g), b)
    minc = np.minimum(np.minimum(r,g), b)
    diff = maxc - minc
    s = np.where(maxc>1e-6, diff/maxc, 0)
    rc = np.where(diff>1e-6, (maxc-r)/diff, 0)
    gc = np.where(diff>1e-6, (maxc-g)/diff, 0)
    bc = np.where(diff>1e-6, (maxc-b)/diff, 0)
    h = np.where(maxc==r, bc-gc, np.where(maxc==g, 2+rc-bc, 4+gc-rc))
    h = (h/6) % 1
    return h*360, s

def classify_hue(hue):
    if hue < 20 or hue >= 340:   return "red"
    if 20  <= hue < 50:           return "mixed"   # orange/yellow
    if 50  <= hue < 80:           return "mixed"   # yellow-green
    if 80  <= hue < 165:          return "green"
    if 165 <= hue < 260:          return "blue"
    if 260 <= hue < 290:          return "purple"
    if 290 <= hue < 340:          return "red"     # magenta→red
    return "mixed"

results = {}
for folder in sorted(os.listdir(FRAMES_ROOT)):
    fpath = os.path.join(FRAMES_ROOT, folder)
    if not os.path.isdir(fpath):
        continue
    files = sorted(os.listdir(fpath))
    if not files:
        continue
    # pick frame at ~40% through (usually full can visible)
    mid = files[int(len(files) * 0.4)]
    img = Image.open(os.path.join(fpath, mid)).convert("RGB")
    arr = np.array(img)
    bg = detect_bg(arr)
    alpha = chroma_key_alpha(arr, bg)
    mask = alpha > 128
    if not mask.any():
        results[folder] = ("unknown", 0, 0)
        continue
    can_pixels = arr[mask].astype(float) / 255.0
    h, s = rgb_to_hue(can_pixels.reshape(-1,3))
    # only colourful pixels (sat > 0.25)
    col_mask = s > 0.25
    if not col_mask.any():
        results[folder] = ("mixed", 0, 0)
        continue
    dominant_hue = np.median(h[col_mask])
    flavor = classify_hue(dominant_hue)
    results[folder] = (flavor, round(dominant_hue, 1), len(files))
    print(f"  folder {folder:4s}  frames={len(files):3d}  hue={dominant_hue:5.1f}  => {flavor}")

print()
print("Mapping:")
for k, (f, h, n) in results.items():
    print(f"  {k} -> {f}  ({n} frames)")
