const fs = require('fs');

const files = [
  'src/components/AIAssistantChat.tsx',
  'src/components/CartDrawer.tsx',
  'src/components/CheckoutPage.tsx',
  'src/components/FloatingMobileCart.tsx',
  'src/components/Header.tsx',
  'src/components/ProductCard.tsx',
  'src/components/ShareModal.tsx',
  'src/components/UserOrdersModal.tsx',
  'src/components/ProductDetailPage.tsx',
  'src/components/TopProductsSection.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('import { formatPrice }') && !content.includes(', formatPrice') && !content.includes('formatPrice,')) {
    // Just inject it at the very top after the first import
    content = content.replace("import React", "import { formatPrice } from '../products.ts';\nimport React");
  }

  if (file === 'src/components/Header.tsx') {
    // currency } = useCart();
    content = content.replace("    activeCategory,", "    currency, setCurrency, activeCategory,");
  }

  if (file === 'src/components/HelpModal.tsx') {
    if (!content.includes('useCart')) {
        content = "import { useCart } from '../context/CartContext.tsx';\n" + content;
    }
  }

  fs.writeFileSync(file, content);
});

console.log("Imports forced");
