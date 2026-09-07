const fs = require('fs');
let file = 'src/context/CartContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { calculateCartTotals, DynamicCoupon } , Currency } from '../products.ts';", "import { calculateCartTotals, DynamicCoupon, Currency } from '../products.ts';");
fs.writeFileSync(file, content);
