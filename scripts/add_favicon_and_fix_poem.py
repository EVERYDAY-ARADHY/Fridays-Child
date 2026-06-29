import glob
import os
import shutil

# 1. Copy the rabbit image
shutil.copy("/Users/advanilshukla/Desktop/code/A gift/dist/assets/9-Bqzfk9zL.png", "public/images/rabbit.png")

# 2. Add favicon and OG tag to all HTML files
head_tags = """<link rel="icon" href="/images/rabbit.png" type="image/png">
  <meta property="og:title" content="Friday's Child">
  <meta property="og:image" content="https://fridays-childislovingandgiving.vercel.app/images/rabbit.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://fridays-childislovingandgiving.vercel.app/images/rabbit.png">"""

for file in glob.glob("*.html"):
    with open(file, "r") as f:
        content = f.read()
    
    if '<link rel="icon"' not in content:
        content = content.replace("<head>", f"<head>\n  {head_tags}")
    
    with open(file, "w") as f:
        f.write(content)

# 3. Fix poem.html to display BOTH description and content
with open("poem.html", "r") as f:
    content = f.read()

# Add the content div
if 'id="poemContent"' not in content:
    content = content.replace('<div id="poemDesc" class="poem-text">...</div>', 
    '<div id="poemDesc" class="poem-text" style="font-style:italic;color:#837375;margin-bottom:24px;font-size:14px;white-space:pre-wrap;">...</div>\n        <div id="poemContent" class="poem-text">...</div>')

# Update the JS to render both
content = content.replace("document.getElementById('poemDesc').textContent=item.description;", 
"document.getElementById('poemDesc').textContent=item.description || '';\n        document.getElementById('poemContent').textContent=item.content || '';")

# Also for the "Not Found" case
content = content.replace('document.getElementById(\'poemDesc\').textContent="This poem has vanished into the digital void.";',
'document.getElementById(\'poemDesc\').textContent="This poem has vanished into the digital void.";\n        document.getElementById(\'poemContent\').textContent="";')

with open("poem.html", "w") as f:
    f.write(content)

