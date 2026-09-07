const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Add formatPrice import
  if (content.includes("from '../products.ts'")) {
    if (!content.includes('formatPrice')) {
      content = content.replace("from '../products.ts'", ", formatPrice, getCurrencySymbol } from '../products.ts'");
    }
  } else {
    // If not imported, might need to add it, but usually useCart is there
  }

  // Get currency from useCart
  if (content.includes("useCart();") && !content.includes("currency")) {
    content = content.replace("} = useCart();", ", currency } = useCart();");
  }

  // Replace standard patterns
  content = content.replace(/S\/ \{(.*?)\.toFixed\(2\)\}/g, "{formatPrice($1, currency)}");
  content = content.replace(/S\/ \{(.*?)\}/g, "{formatPrice($1, currency)}");
  
  // Sometimes it's S/ {price} or similar, but the regex above handles most cases.
  // There are some split cases like:
  // <span className="...">S/</span><span className="..."> {price.toFixed(2)}</span>
  content = content.replace(/<span[^>]*>S\/<\/span>\s*<span[^>]*>\s*\{(.*?)\.toFixed\(2\)\}\s*<\/span>/g, "{formatPrice($1, currency)}");
  
  // Actually it's better to just regex the specific splits we know
  content = content.replace(/<span className="text-xs sm:text-sm font-bold text-slate-500">S\/<\/span>\s*<span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">\s*\{(.*?)\.toFixed\(2\)\}\s*<\/span>/g, `<span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{formatPrice($1, currency)}</span>`);
  
  content = content.replace(/<span className="text-xs font-bold text-slate-500">S\/<\/span>\s*<span className="text-xl font-black text-slate-900 tracking-tight">\s*\{(.*?)\.toFixed\(2\)\}\s*<\/span>/g, `<span className="text-xl font-black text-slate-900 tracking-tight">{formatPrice($1, currency)}</span>`);
  
  content = content.replace(/<span className="text-base sm:text-lg font-bold text-slate-500">S\/<\/span>\s*<span className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">\s*\{(.*?)\.toFixed\(2\)\}\s*<\/span>/g, `<span className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">{formatPrice($1, currency)}</span>`);
  
  content = content.replace(/<span className="text-\[11px\] font-black">S\/<\/span>\s*<span className="text-2xl font-black">\s*\{(.*?)\.toFixed\(2\)\}\s*<\/span>/g, `<span className="text-2xl font-black">{formatPrice($1, currency)}</span>`);

  fs.writeFileSync(file, content);
}

const files = [
  'src/components/ProductCard.tsx',
  'src/components/ProductDetailPage.tsx',
  'src/components/CartDrawer.tsx',
  'src/components/FloatingMobileCart.tsx',
  'src/components/TopProductsSection.tsx',
  'src/components/Hero.tsx',
];

files.forEach(fixFile);
console.log("Components fixed 1");
