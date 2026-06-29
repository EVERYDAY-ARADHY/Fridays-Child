import glob

for file in glob.glob("*.html"):
    with open(file, "r") as f:
        content = f.read()

    # Look for the map chain in home.html and gallery.html
    # Old: map(i=>edited[i.id]?{...i,...edited[i.id]}:i).map(i=>{ if(!i.content) i.content = i.description; return i; });
    
    if ".map(i=>edited[i.id]?{...i,...edited[i.id]}:i).map(i=>{" in content:
        old_chain = ".map(i=>edited[i.id]?{...i,...edited[i.id]}:i).map(i=>{\n        if(!i.content) i.content = i.description;\n        return i;\n      });"
        
        new_chain = ".map(i=>{\n        if(!i.content) i.content = i.description;\n        return i;\n      }).map(i=>edited[i.id]?{...i,...edited[i.id]}:i);"
        
        content = content.replace(old_chain, new_chain)
        
        with open(file, "w") as f:
            f.write(content)

