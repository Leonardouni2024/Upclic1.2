const fs = require('fs');

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');

footer = footer.replace(/            \{onOpenAdminOrders && \(\n              <>\n                \n              <\/>\n            \)\}\n/g, "");

fs.writeFileSync('src/components/Footer.tsx', footer);
console.log("Footer fixed 2");
