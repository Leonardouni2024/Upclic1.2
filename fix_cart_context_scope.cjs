const fs = require('fs');

let file = 'src/context/CartContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// Undo the wrong placement
content = content.replace("  const [items, setItems] = useState<CartItem[]>(() => {\n  const [currency, setCurrency] = useState<Currency>('PEN');", "  const [items, setItems] = useState<CartItem[]>(() => {");

// Inject correctly at the start of CartProvider
content = content.replace("export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {", "export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {\n  const [currency, setCurrency] = useState<Currency>('PEN');");

fs.writeFileSync(file, content);
console.log("CartContext scope fixed");
