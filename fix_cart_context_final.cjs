const fs = require('fs');
let file = 'src/context/CartContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inject currency state correctly
const stateInject = `  const [items, setItems] = useState<CartItem[]>(() => {
  const [currency, setCurrency] = useState<Currency>('PEN');`;

content = content.replace("  const [items, setItems] = useState<CartItem[]>(() => {", stateInject);

// Add Currency import if missing
if (!content.includes("Currency } from '../products.ts'")) {
    content = content.replace("from '../products.ts'", ", Currency } from '../products.ts'");
}

fs.writeFileSync(file, content);
