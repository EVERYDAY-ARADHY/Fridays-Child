import glob
import re

for file in glob.glob("*.html"):
    with open(file, "r") as f:
        content = f.read()
    
    # Replace src="1.png" to src="/images/1.png" (if not already /images/)
    # Regex lookbehind to ensure it doesn't already have images/
    content = re.sub(r'src="(?!\/?images/)(\d+\.png)"', r'src="/images/\1"', content)
    
    with open(file, "w") as f:
        f.write(content)

