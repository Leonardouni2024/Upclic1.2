const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes('WhatsAppButton')) {
  app = app.replace(
    "import { LiveNotifications } from './components/LiveNotifications.tsx';",
    "import { LiveNotifications } from './components/LiveNotifications.tsx';\nimport { WhatsAppButton } from './components/WhatsAppButton.tsx';"
  );

  app = app.replace(
    "<LiveNotifications />",
    "<LiveNotifications />\n        <WhatsAppButton />"
  );

  fs.writeFileSync('src/App.tsx', app);
  console.log("App.tsx updated with WhatsApp Button");
}
