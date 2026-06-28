import glob, re

stickers_html = """
  <div class="sticker" style="top:35%;left:5%;animation:float 7s ease-in-out infinite 0.2s;font-family:'Silkscreen',cursive;color:#c44569;font-size:20px;opacity:0.4;transform:rotate(-15deg);font-weight:bold;">#MUNCHID4LIFE</div>
  <div class="sticker" style="top:70%;right:8%;animation:float-r 6.5s ease-in-out infinite 1.1s;font-family:'Silkscreen',cursive;color:#c44569;font-size:18px;opacity:0.4;transform:rotate(10deg);font-weight:bold;">#TXT</div>
  <div class="sticker" style="bottom:25%;left:8%;animation:float 8s ease-in-out infinite 0.7s;font-family:'Silkscreen',cursive;color:#c44569;font-size:16px;opacity:0.3;transform:rotate(5deg);font-weight:bold;">#MUNCHID4LIFE</div>
"""

for filepath in glob.glob("*.html"):
    with open(filepath, "r") as f:
        content = f.read()
    
    # Find the last occurrence of class="sticker" to insert after it
    # We will search for all sticker lines and find the last one
    lines = content.split('\n')
    last_sticker_idx = -1
    for i, line in enumerate(lines):
        if 'class="sticker"' in line:
            last_sticker_idx = i
            
    if last_sticker_idx != -1:
        lines.insert(last_sticker_idx + 1, stickers_html)
        with open(filepath, "w") as f:
            f.write('\n'.join(lines))
        print(f"Updated {filepath}")
