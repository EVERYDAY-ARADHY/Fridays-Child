import glob, re

for filepath in glob.glob("*.html"):
    with open(filepath, "r") as f:
        content = f.read()
    
    # Replace the bottom-left MUNCHID4LIFE with a top-right one
    old_line = """<div class="sticker" style="bottom:25%;left:8%;animation:float 8s ease-in-out infinite 0.7s;font-family:'Silkscreen',cursive;color:#c44569;font-size:16px;opacity:0.3;transform:rotate(5deg);font-weight:bold;">#MUNCHID4LIFE</div>"""
    new_line = """<div class="sticker" style="top:15%;right:12%;animation:float 8s ease-in-out infinite 0.7s;font-family:'Silkscreen',cursive;color:#c44569;font-size:16px;opacity:0.3;transform:rotate(15deg);font-weight:bold;">#MUNCHID4LIFE</div>"""
    
    content = content.replace(old_line, new_line)
    
    with open(filepath, "w") as f:
        f.write(content)
    print(f"Updated {filepath}")
