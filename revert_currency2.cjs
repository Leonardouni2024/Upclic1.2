const fs = require('fs');

const serverFile = 'server.ts';
let serverContent = fs.readFileSync(serverFile, 'utf8');
serverContent = serverContent.replace(/, EXCHANGE_RATE/g, '');
// If it has conversion logic in server.ts
serverContent = serverContent.replace(/const totalInUSD = req\.body\.currency === 'USD' \? Math\.round\(req\.body\.amount \/ EXCHANGE_RATE \* 100\) \/ 100 : req\.body\.amount;/g, '');
// I don't know the exact logic I injected into server.ts. Let's see what it is.

fs.writeFileSync(serverFile, serverContent);

const files = [
  'src/components/ProductDetailPage.tsx',
  'src/components/TopProductsSection.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/, getCurrencySymbol/g, '');
  content = content.replace(/getCurrencySymbol,\s*/g, '');
  fs.writeFileSync(file, content);
});

