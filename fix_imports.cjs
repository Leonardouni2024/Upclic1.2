const fs = require('fs');

function fixImports(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/} , formatPrice, getCurrencySymbol } from '\.\.\/products\.ts';/g, ", formatPrice, getCurrencySymbol } from '../products.ts';");
  
  if (file === 'src/components/CheckoutPage.tsx' || file === 'src/components/ShareModal.tsx' || file === 'src/components/UserOrdersModal.tsx' || file === 'src/components/AIAssistantChat.tsx') {
    // Also do the S/ replacements for these
    if (content.includes("useCart();") && !content.includes("currency")) {
      content = content.replace("} = useCart();", ", currency } = useCart();");
    }
    content = content.replace(/S\/ \{(.*?)\.toFixed\(2\)\}/g, "{formatPrice($1, currency)}");
    content = content.replace(/S\/ \{(.*?)\}/g, "{formatPrice($1, currency)}");
    content = content.replace(/S\/ \$\{(.*?)\.toFixed\(2\)\}/g, "${formatPrice($1, currency)}");
    
    if (!content.includes('formatPrice')) {
      content = content.replace(/import \{.*?\} from '\.\.\/products\.ts';/, (match) => {
        return match.replace("}", ", formatPrice, getCurrencySymbol }");
      });
    }
  }

  fs.writeFileSync(file, content);
}

const files = [
  'src/components/ProductCard.tsx',
  'src/components/ProductDetailPage.tsx',
  'src/components/CartDrawer.tsx',
  'src/components/FloatingMobileCart.tsx',
  'src/components/TopProductsSection.tsx',
  'src/components/Hero.tsx',
  'src/components/CheckoutPage.tsx',
  'src/components/ShareModal.tsx',
  'src/components/UserOrdersModal.tsx',
  'src/components/AIAssistantChat.tsx'
];

files.forEach(fixImports);
console.log("Imports fixed");
