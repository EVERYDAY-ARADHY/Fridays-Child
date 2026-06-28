import os
import glob

# Update HTML files
for file in glob.glob("*.html"):
    with open(file, "r") as f:
        content = f.read()
    content = content.replace('src="alien.png"', 'src="images/alien.png"')
    content = content.replace('src="scar.png"', 'src="images/scar.png"')
    with open(file, "w") as f:
        f.write(content)

# Update style.css
with open("style.css", "r") as f:
    content = f.read()
content = content.replace("url('cursor8.png')", "url('images/cursor8.png')")
with open("style.css", "w") as f:
    f.write(content)

# Update app.js
with open("app.js", "r") as f:
    lines = f.readlines()
with open("app.js", "w") as f:
    for line in lines:
        if "{ src: '" in line and ".png'" in line:
            line = line.replace("{ src: '", "{ src: 'images/")
        f.write(line)
