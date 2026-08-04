"""Crop product photos from WhatsApp catalog pages (6-item grids)."""

from pathlib import Path
from PIL import Image

REPO = Path(r"c:\Users\B4AIA\Documents\repo")
OUT = Path(__file__).resolve().parent / "images"
OUT.mkdir(parents=True, exist_ok=True)

# Each source page holds products in a 2x3 grid in the middle band.
PAGES = [
    {
        "file": "WhatsApp Image 2026-08-02 at 13.46.51.jpeg",
        "ids": ["001", "002", "003", "004", "005", "006"],
        "top": 0.34,
        "bottom": 0.84,
        "left": 0.09,
        "right": 0.91,
        "cols": 3,
        "rows": 2,
        "gap_x": 0.025,
        "gap_y": 0.09,
    },
    {
        "file": "WhatsApp Image 2026-08-02 at 13.47.46.jpeg",
        "ids": ["007", "008", "009", "010", "011", "012"],
        "top": 0.34,
        "bottom": 0.84,
        "left": 0.09,
        "right": 0.91,
        "cols": 3,
        "rows": 2,
        "gap_x": 0.025,
        "gap_y": 0.09,
    },
    {
        "file": "WhatsApp Image 2026-08-02 at 13.47.46 (1).jpeg",
        "ids": ["013", "014", "015", "016", "017", "018"],
        "top": 0.34,
        "bottom": 0.84,
        "left": 0.09,
        "right": 0.91,
        "cols": 3,
        "rows": 2,
        "gap_x": 0.025,
        "gap_y": 0.09,
    },
    {
        "file": "WhatsApp Image 2026-08-02 at 13.47.46 (2).jpeg",
        "ids": ["019", "020", "021", "022", "023", "024"],
        "top": 0.34,
        "bottom": 0.84,
        "left": 0.09,
        "right": 0.91,
        "cols": 3,
        "rows": 2,
        "gap_x": 0.025,
        "gap_y": 0.09,
    },
    {
        "file": "WhatsApp Image 2026-08-02 at 13.47.46 (3).jpeg",
        "ids": ["025", "026", "027", "028", "029", "030"],
        "top": 0.34,
        "bottom": 0.84,
        "left": 0.09,
        "right": 0.91,
        "cols": 3,
        "rows": 2,
        "gap_x": 0.025,
        "gap_y": 0.09,
    },
    {
        # Last page has 5 products (3 on top, 2 on bottom)
        "file": "WhatsApp Image 2026-08-02 at 13.47.46 (4).jpeg",
        "ids": ["031", "032", "033", "034", "035"],
        "top": 0.34,
        "bottom": 0.84,
        "left": 0.09,
        "right": 0.91,
        "cols": 3,
        "rows": 2,
        "gap_x": 0.025,
        "gap_y": 0.09,
        "custom_slots": [
            (0, 0),
            (0, 1),
            (0, 2),
            (1, 0),
            (1, 1),
        ],
    },
]


def crop_cell(img: Image.Image, page: dict, row: int, col: int) -> Image.Image:
    w, h = img.size
    left = int(page["left"] * w)
    right = int(page["right"] * w)
    top = int(page["top"] * h)
    bottom = int(page["bottom"] * h)
    area_w = right - left
    area_h = bottom - top
    cols = page["cols"]
    rows = page["rows"]
    gap_x = int(page["gap_x"] * w)
    gap_y = int(page["gap_y"] * h)
    cell_w = (area_w - gap_x * (cols - 1)) // cols
    cell_h = (area_h - gap_y * (rows - 1)) // rows
    x0 = left + col * (cell_w + gap_x)
    y0 = top + row * (cell_h + gap_y)
    # Trim number strip at bottom of each cell a bit
    y1 = y0 + int(cell_h * 0.82)
    x1 = x0 + cell_w
    return img.crop((x0, y0, x1, y1))


def main() -> None:
    for page in PAGES:
        src = REPO / page["file"]
        if not src.exists():
            print(f"missing: {src}")
            continue
        img = Image.open(src).convert("RGB")
        slots = page.get("custom_slots")
        if slots is None:
            slots = [(r, c) for r in range(page["rows"]) for c in range(page["cols"])]
        for product_id, (row, col) in zip(page["ids"], slots):
            cropped = crop_cell(img, page, row, col)
            out = OUT / f"{product_id}.jpg"
            cropped.save(out, quality=90)
            print(f"saved {out.name} from {page['file']}")


if __name__ == "__main__":
    main()
