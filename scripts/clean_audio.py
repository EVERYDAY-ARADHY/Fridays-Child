import os
import glob
import json

songs_dir = "public/songs"

# Create a mapping of original filenames to clean filenames
mapping = {
    "AUR - SHIKAYAT - Raffey - Usama - Ahad (Official Music Video).mp3": "aur-shikayat.mp3",
    "Alexander Rybak - Fairytale (Lyrics) Norway  Eurovision Winner 2009.mp3": "fairytale.mp3",
    "Aurora - Runaway (Lyrics).mp3": "aurora-runaway.mp3",
    "Beach Weather - sex, drugs, etc. (Lyrics).mp3": "beach-weather.mp3",
    "Fujii Kaze - Shinunoga E-Wa (Lyrics).mp3": "fujii-kaze.mp3",
    "Full Song_ KHAIRIYAT (BONUS TRACK)  CHHICHHORE  Sushant, Shraddha  Pritam, Amitabh BArijit Singh.mp3": "khairiyat.mp3",
    "Gangubai Kathiawadi  Jhume Re Gori Lyrical  Sanjay Leela Bhansali  Alia Bhatt.mp3": "jhume-re-gori.mp3",
    "Kabhi Kabhi Aditi Lyrics - Rashid Ali, A.R. Rahman  Jaane Tu Ya Jaane Na.mp3": "kabhi-kabhi.mp3",
    "Miracle (기적은 너와 내가 함께하는....mp3": "miracle.mp3",
    "NewJeans 'Ditto' Lyrics (뉴진스 Ditto 가사) (Color Coded Lyrics).mp3": "newjeans-ditto.mp3",
    "Strawberries & Cigarettes.mp3": "strawberries.mp3",
    "Surf Curse - Freaks [Official Audio].mp3": "surf-curse.mp3",
    "TXT - Run Away (Color Coded Lyrics EngRomHan가사).mp3": "txt-runaway.mp3",
    "Taylor Swift - Love Story (Lyrics).mp3": "love-story.mp3",
    "Tu Hai Kahan by AUR  تو ہے کہاں (Official Music Video).mp3": "tu-hai-kahan.mp3",
    "Yeah Yeah Yeahs - Maps (Lyrics).mp3": "maps.mp3"
}

# Find actual files on disk
actual_files = glob.glob(os.path.join(songs_dir, "*.mp3"))
for filepath in actual_files:
    basename = os.path.basename(filepath)
    # The actual file name on disk might be slightly different due to NFD normalization in macOS
    # So we'll try to find a match by comparing normalized strings or looking for keywords
    import unicodedata
    norm_basename = unicodedata.normalize('NFC', basename)
    
    new_name = None
    for k, v in mapping.items():
        if unicodedata.normalize('NFC', k) == norm_basename or k == basename:
            new_name = v
            break
            
    if not new_name:
        # Fallback keyword match
        if "Ditto" in basename: new_name = "newjeans-ditto.mp3"
        elif "TXT" in basename: new_name = "txt-runaway.mp3"
        elif "Miracle" in basename: new_name = "miracle.mp3"
        elif "تو ہے کہاں" in basename or "Tu Hai Kahan" in basename: new_name = "tu-hai-kahan.mp3"
        elif "SHIKAYAT" in basename: new_name = "aur-shikayat.mp3"
        elif "Fairytale" in basename: new_name = "fairytale.mp3"
        elif "Aurora" in basename: new_name = "aurora-runaway.mp3"
        elif "Beach" in basename: new_name = "beach-weather.mp3"
        elif "Shinunoga" in basename: new_name = "fujii-kaze.mp3"
        elif "KHAIRIYAT" in basename: new_name = "khairiyat.mp3"
        elif "Jhume" in basename: new_name = "jhume-re-gori.mp3"
        elif "Aditi" in basename: new_name = "kabhi-kabhi.mp3"
        elif "Strawberries" in basename: new_name = "strawberries.mp3"
        elif "Freaks" in basename: new_name = "surf-curse.mp3"
        elif "Love Story" in basename: new_name = "love-story.mp3"
        elif "Maps" in basename: new_name = "maps.mp3"
    
    if new_name:
        os.rename(filepath, os.path.join(songs_dir, new_name))
        print(f"Renamed {basename} to {new_name}")

# Now update music.js
with open("music.js", "r") as f:
    content = f.read()

for original, new_clean in mapping.items():
    content = content.replace(f"songs/{original}", f"songs/{new_clean}")

# Also replace the Korean text in the source code exactly as it appears
content = content.replace("songs/TXT - Run Away (Color Coded Lyrics EngRomHan가사).mp3", "songs/txt-runaway.mp3")
content = content.replace("songs/NewJeans 'Ditto' Lyrics (뉴진스 Ditto 가사) (Color Coded Lyrics).mp3", "songs/newjeans-ditto.mp3")
content = content.replace("songs/Miracle (기적은 너와 내가 함께하는....mp3", "songs/miracle.mp3")
content = content.replace("songs/Tu Hai Kahan by AUR  تو ہے کہاں (Official Music Video).mp3", "songs/tu-hai-kahan.mp3")

with open("music.js", "w") as f:
    f.write(content)

