const fs = require('fs');
let detail = fs.readFileSync('src/components/ProductDetailPage.tsx', 'utf8');

// We need to find where the badge is rendered and add the discount there too.
const calculateStr = `
  const activePrice = currentVariant ? currentVariant.price : product.price;
  const activeOldPrice = currentVariant ? currentVariant.oldPrice : product.oldPrice;
  const discountPercent = activeOldPrice && activeOldPrice > activePrice 
    ? Math.round(((activeOldPrice - activePrice) / activeOldPrice) * 100) 
    : 0;
`;

if (detail.includes("const activePrice = currentVariant ? currentVariant.price : product.price;")) {
  detail = detail.replace(
    "const activePrice = currentVariant ? currentVariant.price : product.price;\n  const activeOldPrice = currentVariant ? currentVariant.oldPrice : product.oldPrice;",
    calculateStr
  );
  
  // Find where badge is rendered
  const badgeRegex = /\{product\.badge && \(\s*<div[\s\S]*?<\/div>\s*\)\}/;
  
  const discountBadgeStr = `{product.badge && (
                  <div className={\`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider \${
                    product.badge.includes('TOP') || product.badge.includes('MÁS VENDIDO') 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }\`}>
                    {product.badge}
                  </div>
                )}
                {discountPercent > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-white bg-red-500 shadow-sm shadow-red-500/20">
                    AHORRAS {discountPercent}%
                  </div>
                )}`;
                
  detail = detail.replace(badgeRegex, discountBadgeStr);
  
  fs.writeFileSync('src/components/ProductDetailPage.tsx', detail);
  console.log("ProductDetailPage updated");
} else {
  console.log("Could not find price logic in ProductDetailPage");
}
