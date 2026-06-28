import os

# creation.html
with open('creation.html', 'r') as f:
    content = f.read()
content = content.replace('<option value="Video">Video</option>\n', '')
content = content.replace("['Art', 'Picture', 'Video']", "['Art', 'Picture']")
with open('creation.html', 'w') as f:
    f.write(content)

# gallery.html
with open('gallery.html', 'r') as f:
    content = f.read()
content = content.replace('<button class="filter-pill" onclick="setFilter(\'Video\', this)">Videos</button>\n', '')
content = content.replace("['Art', 'Picture', 'Video']", "['Art', 'Picture']")
with open('gallery.html', 'w') as f:
    f.write(content)

# home.html
with open('home.html', 'r') as f:
    content = f.read()
content = content.replace("width: min(850px, 95vw) !important;", "width: min(850px, 95vw);")
content = content.replace("['Poems', 'Stories', 'Essays', 'Videos', 'Art', 'Pictures']", "['Poems', 'Stories', 'Essays', 'Art', 'Pictures']")
content = content.replace("{'Poems':'Poem', 'Stories':'Story', 'Essays':'Essay', 'Videos':'Video', 'Art':'Art', 'Pictures':'Picture'}", "{'Poems':'Poem', 'Stories':'Story', 'Essays':'Essay', 'Art':'Art', 'Pictures':'Picture'}")
content = content.replace("['Art', 'Picture', 'Video']", "['Art', 'Picture']")
with open('home.html', 'w') as f:
    f.write(content)
