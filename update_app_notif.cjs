const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "import { FloatingTestimonials } from './components/FloatingTestimonials.tsx';",
  "import { LiveNotifications } from './components/LiveNotifications.tsx';"
);

app = app.replace(
  "<FloatingTestimonials />",
  "<LiveNotifications />"
);

fs.writeFileSync('src/App.tsx', app);
console.log("App.tsx updated for notifications");
