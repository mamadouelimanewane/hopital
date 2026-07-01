"""Generate a Ndamatou hospital illustration for PDF cover."""
from PIL import Image, ImageDraw, ImageFont
import math

W, H = 800, 400
img = Image.new("RGB", (W, H), (240, 245, 252))
d = ImageDraw.Draw(img)

# Sky gradient (top section)
for y in range(260):
    r = int(180 + (220-180)*y/260)
    g = int(210 + (235-210)*y/260)
    b = int(240 + (252-240)*y/260)
    d.line([(0,y),(W,y)], fill=(r,g,b))

# Ground
d.rectangle([0,260,W,H], fill=(200,215,185))
d.rectangle([0,258,W,268], fill=(170,190,155))

# Road / path
d.rectangle([320,265,480,400], fill=(190,185,175))
d.rectangle([390,260,410,400], fill=(210,205,195))

# Trees
for tx in [60,110,650,700,740]:
    d.rectangle([tx-4,230,tx+4,268], fill=(120,90,60))
    d.ellipse([tx-22,195,tx+22,240], fill=(60,130,60))
    d.ellipse([tx-18,185,tx+18,225], fill=(80,160,70))

# MAIN BUILDING — large central block
d.rectangle([120,100,680,262], fill=(235,228,215))
d.rectangle([118,98,682,264], outline=(180,165,145), width=2)

# Facade columns
for cx in range(150, 680, 45):
    d.rectangle([cx,130,cx+8,262], fill=(220,210,195))

# Central entrance
d.rectangle([350,180,450,262], fill=(160,185,210))
d.rectangle([348,178,452,264], outline=(120,140,170), width=2)

# Entrance canopy
d.polygon([330,175,470,175,460,155,340,155], fill=(150,100,60))
d.rectangle([330,173,470,177], fill=(120,80,45))

# Steps
d.rectangle([340,262,460,270], fill=(210,205,195))
d.rectangle([345,270,455,276], fill=(200,195,182))

# Windows — main floor
for wx in [140,190,240,490,540,590,630]:
    d.rectangle([wx,120,wx+30,155], fill=(160,185,210))
    d.rectangle([wx,120,wx+30,155], outline=(140,160,185), width=1)
    d.line([(wx+15,120),(wx+15,155)], fill=(140,160,185), width=1)
    d.line([(wx,137),(wx+30,137)], fill=(140,160,185), width=1)

# Windows — upper floor
for wx in [140,190,240,290,330,470,510,550,590,630]:
    d.rectangle([wx,160,wx+25,190], fill=(170,195,220))
    d.rectangle([wx,160,wx+25,190], outline=(140,160,185), width=1)

# Roof / cornice
d.rectangle([115,88,685,105], fill=(150,100,60))
d.rectangle([115,86,685,90], fill=(120,80,45))

# Side wings
d.rectangle([50,140,125,262], fill=(228,220,208))
d.rectangle([675,140,750,262], fill=(228,220,208))
# Wing windows
for wy in [155,185,215]:
    d.rectangle([65,wy,105,wy+22], fill=(160,185,210))
    d.rectangle([690,wy,730,wy+22], fill=(160,185,210))

# Flagpole + crescent
d.rectangle([395,50,400,102], fill=(100,80,60))
# Crescent
for angle in range(-60, 60, 2):
    rad = math.radians(angle)
    x1 = 397 + 14*math.cos(rad)
    y1 = 58 + 14*math.sin(rad)
    d.ellipse([x1-2,y1-2,x1+2,y1+2], fill=(0,100,60))
for angle in range(-50, 50, 2):
    rad = math.radians(angle)
    x1 = 401 + 10*math.cos(rad)
    y1 = 58 + 10*math.sin(rad)
    d.ellipse([x1-2,y1-2,x1+2,y1+2], fill=(240,245,252))

# Star next to crescent
d.ellipse([414,50,420,56], fill=(0,120,70))

# Sign on building
d.rectangle([270,205,530,240], fill=(10,50,100))
d.rectangle([268,203,532,242], outline=(200,180,100), width=2)
try:
    font_sign = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 13)
    font_sub  = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 10)
except:
    font_sign = ImageFont.load_default()
    font_sub  = font_sign

d.text((400,212), "Ndamatou", fill=(255,220,100), font=font_sign, anchor="mm")
d.text((400,228), "Centre Hospitalier National Ndamatoul Khadim", fill=(200,215,240), font=font_sub, anchor="mm")

# Ambulance
d.rectangle([170,248,240,268], fill=(255,255,255))
d.rectangle([168,246,242,270], outline=(220,30,30), width=2)
d.rectangle([168,246,205,255], fill=(220,30,30))
d.text((204,258), "+", fill=(220,30,30), font=font_sign, anchor="mm")
d.ellipse([178,266,192,280], fill=(60,60,60))
d.ellipse([220,266,234,280], fill=(60,60,60))

# Save
img.save("C:/gravity/hopital/ndamatou_building.jpg", quality=92)
print("Image OK: C:/gravity/hopital/ndamatou_building.jpg")
