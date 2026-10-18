from PIL import Image
import numpy as np

samples = ["green", "blue", "red", "purple", "mixed"]
for name in samples:
    img = Image.open(f"D:/fanta/assets/samples/{name}.png").convert("RGB")
    arr = np.array(img)
    h, w = arr.shape[:2]
    corners = np.vstack([
        arr[:30, :30].reshape(-1, 3),
        arr[:30, -30:].reshape(-1, 3),
        arr[-30:, :30].reshape(-1, 3),
        arr[-30:, -30:].reshape(-1, 3),
        arr[:30, w//2-15:w//2+15].reshape(-1, 3),
        arr[-30:, w//2-15:w//2+15].reshape(-1, 3),
    ])
    bg = np.median(corners, axis=0).astype(int)
    print(f"{name:8s}: RGB({bg[0]:3d},{bg[1]:3d},{bg[2]:3d})  => #{bg[0]:02X}{bg[1]:02X}{bg[2]:02X}")
