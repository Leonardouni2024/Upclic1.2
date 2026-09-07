const fs = require('fs');

const filesToFix = [
  'src/components/ProductCard.tsx',
  'src/components/ProductDetailPage.tsx',
  'src/components/CartDrawer.tsx',
  'src/components/FloatingMobileCart.tsx',
  'src/components/TopProductsSection.tsx',
  'src/components/Hero.tsx',
];

filesToFix.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(" , currency } = useCart();", ", currency } = useCart();");
  fs.writeFileSync(file, content);
});

