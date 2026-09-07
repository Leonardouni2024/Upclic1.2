const fs = require('fs');

let file = 'src/components/HelpModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// import useCart
content = content.replace("import { HelpCircle } from 'lucide-react';", "import { HelpCircle } from 'lucide-react';\nimport { useCart } from '../context/CartContext.tsx';");

// useCart in component
content = content.replace("export const HelpModal: React.FC<HelpModalProps> = ({ topic, onClose }) => {", "export const HelpModal: React.FC<HelpModalProps> = ({ topic, onClose }) => {\n  const { currency } = useCart();");

// Replace text
content = content.replace(
  "Directamente en la tienda a través de Mercado Pago. Puedes pagar con tarjeta de débito o crédito, Yape, PagoEfectivo o banca por internet. El cobro es en soles (S/) y la confirmación se procesa en tiempo real.",
  "Directamente en la tienda a través de Mercado Pago. Puedes pagar con tarjeta de débito o crédito, o efectivo. El cobro se procesará en tu moneda local y la confirmación es en tiempo real."
);

fs.writeFileSync(file, content);
console.log("HelpModal fixed");
