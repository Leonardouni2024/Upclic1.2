const fs = require('fs');
let hero = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Update Title
hero = hero.replace(
  'Licencias Microsoft <br className="hidden sm:inline" />',
  'Software Original y Seguro <br className="hidden sm:inline" />'
);

hero = hero.replace(
  'para tu PC',
  'para Profesionales'
);

// Update Subtitle
hero = hero.replace(
  'Office y Windows con entrega digital y atención personalizada.',
  'Windows, Office, Project, Visio y más. Entrega digital inmediata y garantía total.'
);

// Update buttons
hero = hero.replace(
  'Ver Office',
  'Ver Catálogo Microsoft'
);
hero = hero.replace(
  'Ver Windows',
  'Explorar Software'
);

fs.writeFileSync('src/components/Hero.tsx', hero);
console.log("Hero updated");
