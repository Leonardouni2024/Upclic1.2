const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "<Header />",
  "<Header onOpenUserOrders={() => setIsUserOrdersModalOpen(true)} />"
);

fs.writeFileSync('src/App.tsx', app);
console.log("App.tsx header fixed");
