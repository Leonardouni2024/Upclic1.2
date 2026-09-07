const fs = require('fs');
let file = 'src/components/HelpModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useCart')) {
  content = "import { useCart } from '../context/CartContext.tsx';\n" + content;
}

if (!content.includes('const { currency } = useCart()')) {
  content = content.replace("export const HelpModal: React.FC<HelpModalProps> = ({ topic, onClose }) => {", "export const HelpModal: React.FC<HelpModalProps> = ({ topic, onClose }) => {\n  const { currency } = useCart();");
}

fs.writeFileSync(file, content);
console.log("HelpModal fixed");
