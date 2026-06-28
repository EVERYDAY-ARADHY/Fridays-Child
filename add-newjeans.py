import glob

new_sticker = """  <div class="sticker" style="top:40%;right:25%;animation:float 7.5s ease-in-out infinite 0.9s;font-family:'Silkscreen',cursive;color:#c44569;font-size:22px;opacity:0.3;transform:rotate(-8deg);font-weight:bold;">#NEWJEANS</div>\n"""

for filepath in glob.glob("*.html"):
    with open(filepath, "r") as f:
        content = f.read()
    
    # insert before the first <div class="sticker" we added earlier
    # or just replace #TXT line with #TXT \n #NEWJEANS
    
    old_line = """<div class="sticker" style="top:70%;right:8%;animation:float-r 6.5s ease-in-out infinite 1.1s;font-family:'Silkscreen',cursive;color:#c44569;font-size:18px;opacity:0.4;transform:rotate(10deg);font-weight:bold;">#TXT</div>"""
    
    if old_line in content:
        content = content.replace(old_line, old_line + "\n" + new_sticker)
        with open(filepath, "w") as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"Failed to find insertion point in {filepath}")
