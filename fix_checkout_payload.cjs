const fs = require('fs');

let file = 'src/components/CheckoutPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "          total,",
  "          total,\n          currency,"
);

fs.writeFileSync(file, content);
console.log("Checkout payload fixed");
