"""Validate, shrink and store uploaded images."""
import io
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError

MAX_SIDE_PIXELS = 1800
MAX_UPLOAD_BYTES = 10 * 1024 * 1024


def save_upload(upload: UploadFile, upload_dir: Path) -> str:
    """Store the uploaded image as a web-sized file and return its file name."""
    data = upload.file.read(MAX_UPLOAD_BYTES + 1)
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "Image larger than 10 MB")
    try:
        image = Image.open(io.BytesIO(data))
        image.load()
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
        raise HTTPException(400, "File is not a valid image")
    image = ImageOps.exif_transpose(image)
    image.thumbnail((MAX_SIDE_PIXELS, MAX_SIDE_PIXELS))
    name = f"{uuid.uuid4().hex[:12]}.jpg"
    upload_dir.mkdir(parents=True, exist_ok=True)
    flattened = Image.new("RGB", image.size, "white")
    flattened.paste(image.convert("RGBA"), mask=image.convert("RGBA").getchannel("A"))
    flattened.save(upload_dir / name, "JPEG", quality=88)
    return name
