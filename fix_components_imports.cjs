const fs = require('fs');

const files = [
  'src/components/AIAssistantChat.tsx',
  'src/components/CartDrawer.tsx',
  'src/components/CheckoutPage.tsx',
  'src/components/FloatingMobileCart.tsx',
  'src/components/Header.tsx',
  'src/components/ProductCard.tsx',
  'src/components/ShareModal.tsx',
  'src/components/UserOrdersModal.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace("} , formatPrice", ", formatPrice");
  content = content.replace("}, formatPrice", ", formatPrice");
  
  if (content.includes("import { formatPrice } from '../products.ts';\nimport { formatPrice } from '../products.ts';")) {
     content = content.replace("import { formatPrice } from '../products.ts';\nimport { formatPrice } from '../products.ts';", "import { formatPrice } from '../products.ts';");
  }
  
  fs.writeFileSync(file, content);
});

console.log("Imports fixed 2");
