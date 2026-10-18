"""Sample 6 evenly-spaced frames from folders 02 and 03 and print hue + saturation stats."""
import os
import numpy as np
from PIL import Image

FRAMES_ROOT = r"D:\fanta\assets\frames"

def detect_bg(arr):
    patches = np.vstack([arr[:30,:30].reshape(-1,3), arr[:30,-30:].reshape(-1,3),
                         arr[-30:,:30].reshape(-1,3), arr[-30:,-30:].reshape(-1,3)])
    return np.median(patches, axis=0)

def chroma_mask(arr, bg, tol=55):
    diff = np.sqrt(np.sum((arr.astype(float)-bg)**2, axis=2))
    return (np.clip((diff-tol)/20,0,1)*255).astype(np.uint8) > 128

def rgb_to_hs(arr_f):
    r,g,b = arr_f[:,0],arr_f[:,1],arr_f[:,2]
    maxc = np.maximum(np.maximum(r,g),b)
    minc = np.minimum(np.minimum(r,g),b)
    diff = maxc-minc
    s = np.where(maxc>1e-6, diff/maxc, 0)
    rc = np.where(diff>1e-6,(maxc-r)/diff,0); gc = np.where(diff>1e-6,(maxc-g)/diff,0); bc = np.where(diff>1e-6,(maxc-b)/diff,0)
    h = np.where(maxc==r, bc-gc, np.where(maxc==g, 2+rc-bc, 4+gc-rc))
    h = (h/6)%1
    return h*360, s

for folder in ["02","03"]:
    path = os.path.join(FRAMES_ROOT, folder)
    files = sorted(os.listdir(path))
    n = len(files)
    indices = [int(i*(n-1)/5) for i in range(6)]
    print(f"\nFolder {folder} ({n} frames):")
    for idx in indices:
        img = Image.open(os.path.join(path, files[idx])).convert("RGB")
        arr = np.array(img)
        bg = detect_bg(arr)
        mask = chroma_mask(arr, bg)
        if not mask.any():
            print(f"  frame {idx:3d}: no can pixels")
            continue
        pix = arr[mask].astype(float)/255
        h, s = rgb_to_hs(pix)
        col = s > 0.3
        if col.any():
            med_h = np.median(h[col])
            med_s = np.median(s[col])
            # top 3 hue bins (30deg each)
            bins = np.floor(h[col]/30).astype(int)
            counts = np.bincount(np.clip(bins,0,11), minlength=12)
            top3 = np.argsort(counts)[-3:][::-1]
            top3_str = ", ".join(f"{int(b)*30}-{int(b)*30+30}deg({counts[b]})" for b in top3)
            print(f"  frame {idx:3d}: median_hue={med_h:5.1f}  sat={med_s:.2f}  top_hue_ranges=[{top3_str}]")
        else:
            print(f"  frame {idx:3d}: mostly grey/white can")
