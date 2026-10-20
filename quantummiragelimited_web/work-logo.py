from PIL import Image, ImageDraw
w,h = 296, 85
img = Image.new("RGBA",(w,h),(0,0,0,0))
d = ImageDraw.Draw(img)
d.rounded_rectangle([2,10,72,78], radius=18, fill=(215,255,62,255))
d.rectangle([26,32,48,56], fill=(10,10,12,255))
d.text((86,20), "QUANTUM MIRAGE", fill=(244,242,236,255))
d.text((86,50), "量子幻影", fill=(139,138,146,255))
img.save("assets/img/logo.png")
print("demo wide logo written")
