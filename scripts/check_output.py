"""Check the actual can pixel coverage in the output WebP frames."""
from PIL import Image
import numpy as np, os

OUT_ROOT = r"D:\fanta\public\can-frames"
for flavor in ["green","blue","red","purple","mixed"]:
    d = os.path.join(OUT_ROOT, flavor)
    frames = sorted(f for f in os.listdir(d) if f.endswith(".webp"))
    # sample middle frame
    mid = frames[len(frames)//2]
    img = Image.open(os.path.join(d, mid))
    a = np.array(img.split()[3])
    rows = np.any(a > 30, axis=1)
    cols = np.any(a > 30, axis=0)
    if rows.any():
        rmin, rmax = np.where(rows)[0][[0,-1]]
        cmin, cmax = np.where(cols)[0][[0,-1]]
        can_h = rmax - rmin
        can_w = cmax - cmin
        canvas_h, canvas_w = a.shape
        print(f"{flavor:8s}: canvas={canvas_w}x{canvas_h}  can={can_w}x{can_h}  "
              f"fill={can_h/canvas_h*100:.0f}% height  {can_w/canvas_w*100:.0f}% width")
    else:
        print(f"{flavor:8s}: no can pixels found!")
