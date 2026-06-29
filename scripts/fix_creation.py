import re

with open('creation.html', 'r') as f:
    content = f.read()

# 1. Add the second textarea
desc_block = """      <div style="margin-bottom:28px;">
        <label class="field-label" id="descLabel">Poem Content</label>
        <textarea id="entryDesc" class="clay-input" rows="5" placeholder="Write your poem here..."></textarea>
      </div>"""

new_blocks = """      <div style="margin-bottom:28px;">
        <label class="field-label" id="descLabel">Description / Lore</label>
        <textarea id="entryDesc" class="clay-input" rows="3" placeholder="Significance to her, lore, or description..."></textarea>
      </div>

      <div id="contentContainer" style="margin-bottom:28px; display:none;">
        <label class="field-label" id="contentLabel">Poem / Story Body</label>
        <textarea id="entryContent" class="clay-input" rows="8" placeholder="Write your poem or story here..."></textarea>
      </div>"""

if 'id="entryContent"' not in content:
    content = content.replace(desc_block, new_blocks)

# 2. Update publish()
if "const contentText=document.getElementById('entryContent')" not in content:
    content = content.replace("const desc=document.getElementById('entryDesc').value.trim();",
"""const desc=document.getElementById('entryDesc').value.trim();
      const contentEl=document.getElementById('entryContent');
      const contentText=contentEl ? contentEl.value.trim() : null;""")
    
    content = content.replace("description:desc,",
"""description:desc,
        content:contentText || null,""")

# 3. Update updateFormLabels() to show/hide content field
old_update = """    function updateFormLabels() {
      const type = currentMainType === 'Written' ? document.getElementById('typeWritten').value : document.getElementById('typeVisual').value;
      let label = 'Poem Content';
      let ph = 'Write your poem here...';
      if(type==='Story') { label = 'Story Content'; ph = 'Write your story here...'; }
      if(type==='Essay') { label = 'Essay Content'; ph = 'Write your essay here...'; }
      if(['Art', 'Picture'].includes(type)) { label = 'Description'; ph = 'Tell us about this piece...'; }
      
      document.getElementById('descLabel').textContent = label;
      document.getElementById('entryDesc').placeholder = ph;
    }"""

new_update = """    function updateFormLabels() {
      const type = currentMainType === 'Written' ? document.getElementById('typeWritten').value : document.getElementById('typeVisual').value;
      const isVisual = currentMainType === 'Visual';
      
      const contentCont = document.getElementById('contentContainer');
      if(contentCont) {
         if(isVisual) {
            contentCont.style.display = 'none';
            document.getElementById('descLabel').textContent = 'Description / Lore';
            document.getElementById('entryDesc').placeholder = 'Tell us about this artwork...';
         } else {
            contentCont.style.display = 'block';
            document.getElementById('descLabel').textContent = 'Significance to Her / Lore';
            document.getElementById('entryDesc').placeholder = 'Why is this significant...';
            
            let label = 'Poem Content';
            let ph = 'Write your poem here...';
            if(type==='Story') { label = 'Story Content'; ph = 'Write your story here...'; }
            if(type==='Essay') { label = 'Essay Content'; ph = 'Write your essay here...'; }
            
            document.getElementById('contentLabel').textContent = label;
            document.getElementById('entryContent').placeholder = ph;
         }
      }
    }"""

content = content.replace(old_update, new_update)

with open('creation.html', 'w') as f:
    f.write(content)

