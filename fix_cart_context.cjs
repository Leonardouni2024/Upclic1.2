const fs = require('fs');

let content = fs.readFileSync('src/context/CartContext.tsx', 'utf8');

// Add import Currency
content = content.replace(
  "import { Product, ProductCategory, CartTotals, calculateCartTotals, DynamicCoupon, generateDynamicCoupon } from '../products.ts';",
  "import { Product, ProductCategory, CartTotals, calculateCartTotals, DynamicCoupon, generateDynamicCoupon, Currency } from '../products.ts';"
);

// Add to CartContextType
content = content.replace(
  "  removeCoupon: () => void;",
  "  removeCoupon: () => void;\n  currency: Currency;\n  setCurrency: (c: Currency) => void;"
);

// Add to CartProvider
const stateInjection = `  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>('PEN');`;
content = content.replace("  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);", stateInjection);

// Add to context value
content = content.replace(
  "      removeCoupon,",
  "      removeCoupon,\n      currency,\n      setCurrency,"
);

fs.writeFileSync('src/context/CartContext.tsx', content);
console.log("CartContext fixed");
