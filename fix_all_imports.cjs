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
  if (!content.includes('formatPrice')) {
    content = content.replace("from '../products.ts';", ", formatPrice } from '../products.ts';");
  }
  // Let's just blindly try to inject it if not present in the import block
  if (!content.includes('formatPrice')) {
      content = "import { formatPrice } from '../products.ts';\n" + content;
  }
  
  if (file === 'src/components/Header.tsx') {
    if (!content.includes('currency } = useCart()')) {
        content = content.replace("const { cartCount, setIsCartOpen, navigateToHome, currentPath } = useCart();", "const { cartCount, setIsCartOpen, navigateToHome, currentPath, currency, setCurrency } = useCart();");
    }
  }

  fs.writeFileSync(file, content);
});

console.log("Imports fixed");
