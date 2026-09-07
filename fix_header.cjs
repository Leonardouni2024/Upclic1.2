const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

// import { formatPrice, getCurrencySymbol }
content = content.replace(
  "import { products } from '../products.ts';",
  "import { products, formatPrice, getCurrencySymbol, Currency } from '../products.ts';"
);

// We need to inject the currency selector. Let's put it next to the cart icon in the header.
// Look for `<div className="flex items-center gap-2 sm:gap-4 ml-auto lg:ml-0">`
const insertTarget = `<div className="flex items-center gap-2 sm:gap-4 ml-auto lg:ml-0">`;
const selector = `
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setCurrency('PEN')}
              className={\`px-2 py-1 text-xs font-bold rounded-md transition-all \${currency === 'PEN' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
            >
              PEN
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={\`px-2 py-1 text-xs font-bold rounded-md transition-all \${currency === 'USD' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
            >
              USD
            </button>
          </div>
`;

content = content.replace(insertTarget, insertTarget + selector);

// Update price displays in the search results
content = content.replace(/S\/ \{prod.price.toFixed\(2\)\}/g, "{formatPrice(prod.price, currency)}");
content = content.replace(/S\/ \{prod.oldPrice.toFixed\(2\)\}/g, "{formatPrice(prod.oldPrice, currency)}");

// Extract currency from useCart in Header
content = content.replace(
  "const { cartCount, setIsCartOpen, navigateToHome, currentPath } = useCart();",
  "const { cartCount, setIsCartOpen, navigateToHome, currentPath, currency, setCurrency } = useCart();"
);

fs.writeFileSync('src/components/Header.tsx', content);
console.log("Header fixed");
