import glob

# 1. Fix absolute paths in HTML files
for file in glob.glob("*.html"):
    with open(file, "r") as f:
        content = f.read()
    content = content.replace('src="images/alien.png"', 'src="/images/alien.png"')
    content = content.replace('src="images/scar.png"', 'src="/images/scar.png"')
    
    # 2. Add missing scripts to art.html and poem.html
    if file in ['art.html', 'poem.html']:
        if 'music.js' not in content:
            content = content.replace('<script type="module" src="pixel_trail.js"></script>', '<script type="module" src="/pixel_trail.js"></script>\n  <script type="module" src="/music.js"></script>\n  <script src="/app.js"></script>')
        else:
            content = content.replace('src="pixel_trail.js"', 'src="/pixel_trail.js"')
            content = content.replace('src="music.js"', 'src="/music.js"')
            content = content.replace('src="app.js"', 'src="/app.js"')
            
    with open(file, "w") as f:
        f.write(content)

# 3. Fix app.js
with open("app.js", "r") as f:
    content = f.read()
content = content.replace("{ src: 'images/", "{ src: '/images/")
with open("app.js", "w") as f:
    f.write(content)

# 4. Fix style.css
with open("style.css", "r") as f:
    content = f.read()
content = content.replace("url('images/cursor8.png')", "url('/images/cursor8.png')")
with open("style.css", "w") as f:
    f.write(content)

