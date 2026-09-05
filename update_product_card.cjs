const fs = require('fs');
let card = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

// Calculate discount
const calculateStr = `
  const activePrice = currentVariant ? currentVariant.price : product.price;
  const activeOldPrice = currentVariant ? currentVariant.oldPrice : product.oldPrice;
  const discountPercent = activeOldPrice && activeOldPrice > activePrice 
    ? Math.round(((activeOldPrice - activePrice) / activeOldPrice) * 100) 
    : 0;
`;

card = card.replace(
  "const activePrice = currentVariant ? currentVariant.price : product.price;\n  const activeOldPrice = currentVariant ? currentVariant.oldPrice : product.oldPrice;",
  calculateStr
);

// Update badge area
const badgeHtml = `{product.badge ? (
            <span
              className={\`px-2.5 py-1 text-[10px] sm:text-[11px] font-black rounded-lg uppercase tracking-wide shadow-2xs border border-white/20 \${
                product.badge.includes('TOP') || product.badge.includes('MÁS VENDIDO')
                  ? 'bg-[#0066FF] text-white'
                  : product.badge.includes('1 AÑO')
                  ? 'bg-purple-600 text-white'
                  : 'bg-amber-500 text-white'
              }\`}
            >
              {product.badge}
            </span>
          ) : (
            <div></div>
          )}
          
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg shadow-2xs border border-white/20">
              -{discountPercent}%
            </span>
          )}`;
          
card = card.replace(
  /\{product\.badge \? \([\s\S]*?\n          \) : \(\n            <div><\/div>\n          \)\}/,
  badgeHtml
);

fs.writeFileSync('src/components/ProductCard.tsx', card);
console.log("ProductCard updated");
