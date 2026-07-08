const fs = require('fs');
const files = ['gallery.html', 'home.html', 'poem.html', 'art.html', 'creation.html', 'about.html'];

const cssToInject = `
    @media (max-width: 768px) {
      .top-nav { flex-direction: column; gap: 12px; padding: 12px 16px; }
      #topNav nav { flex-wrap: wrap; justify-content: center; gap: 8px !important; }
      .site-name { font-size: 16px !important; }
      .gallery-card { width: 100%; }
      #galleryGrid { grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)) !important; }
      .poem-container, .art-container, .clay-card { width: 100% !important; border-radius: 16px !important; }
    }
`;

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Inject responsive CSS if not already present
    if (!content.includes('@media (max-width: 768px)')) {
      content = content.replace('.owner-badge {', '.owner-badge {' + cssToInject);
      
      // Also ensure galleryGrid has the safer minmax
      content = content.replace('minmax(280px,1fr)', 'minmax(min(100%, 280px), 1fr)');
      
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
}
