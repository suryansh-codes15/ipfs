import fitz
import numpy as np
from PIL import Image
import os

def apply_theme_transparent(img):
    img = img.convert("RGBA")
    data = np.array(img, dtype=np.float32)
    
    # Calculate luminance
    gray = 0.299 * data[:,:,0] + 0.587 * data[:,:,1] + 0.114 * data[:,:,2]
    gray = gray / 255.0
    
    # Colors (RGBA)
    dark = np.array([28, 54, 38, 255])
    mid  = np.array([47, 90, 62, 255])
    
    # We want bright areas (white backgrounds) to be completely transparent.
    light = np.array([47, 90, 62, 0])
    
    # Interpolation limits
    mask_low = gray < 0.5
    mask_high = gray >= 0.5
    
    new_data = np.zeros_like(data)
    
    # Low end (0 to 0.5 is scaled to 0 to 1) -> Interpolate Dark to Mid
    factor_low = (gray[mask_low] * 2.0)[:, np.newaxis]
    new_data[mask_low] = dark * (1 - factor_low) + mid * factor_low
    
    # High end (0.5 to 1.0 is scaled to 0 to 1) -> Interpolate Mid to Transparent
    factor_high = ((gray[mask_high] - 0.5) * 2.0)[:, np.newaxis]
    new_data[mask_high] = mid * (1 - factor_high) + light * factor_high
    
    return Image.fromarray(new_data.astype(np.uint8))

def process_pdf(file_path):
    print(f"Processing {file_path}...")
    doc = fitz.open(file_path)
    out_pdf = fitz.open()
    
    # Load the background image
    try:
        bg_orig = Image.open('bg.png').convert("RGBA")
    except Exception as e:
        print("Could not load bg.png: ", e)
        return
        
    for i in range(len(doc)):
        page = doc[i]
        print(f"  Page {i+1}/{len(doc)}")
        
        # High DPI for crisp text
        pix = page.get_pixmap(dpi=200)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        # 1. Transform page: text colors mapped, background becomes transparent
        transparent_page = apply_theme_transparent(img)
        
        # 2. Resize our bg.png to match the exact page bounds
        bg = bg_orig.resize(transparent_page.size, Image.Resampling.LANCZOS)
        
        # 3. Composite! 
        # bg is our bottom layer (SVG geometries + cream background)
        # transparent_page is exactly the text/graphics of the original PDF
        final_img = Image.alpha_composite(bg, transparent_page)
        
        # Convert PIL image to bytes (JPEG because no transparency needed anymore)
        final_rgb = final_img.convert("RGB")
        import io
        img_byte_arr = io.BytesIO()
        final_rgb.save(img_byte_arr, format='JPEG', quality=85)
        img_bytes = img_byte_arr.getvalue()
        
        # Insert into new document
        rect = fitz.Rect(0, 0, page.rect.width, page.rect.height)
        new_page = out_pdf.new_page(width=page.rect.width, height=page.rect.height)
        new_page.insert_image(rect, stream=img_bytes)
        
    output_path = file_path.replace('.pdf', '_themed.pdf')
    out_pdf.save(output_path, garbage=3, deflate=True)
    out_pdf.close()
    doc.close()
    print(f"Saved to {output_path}")

print("Starting background injection...")
import glob
pdfs = glob.glob('assets/*.pdf')
for p in pdfs:
    process_pdf(p)
print("Done!")
