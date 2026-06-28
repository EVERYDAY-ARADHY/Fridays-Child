const fs = require('fs');
const files = ['gallery.html', 'about.html', 'creation.html', 'home.html', 'index.html'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<script src="music\.js"><\/script>/g, '<script type="module" src="music.js"></script>');
  fs.writeFileSync(file, content);
}
console.log('Fixed music.js tags');
