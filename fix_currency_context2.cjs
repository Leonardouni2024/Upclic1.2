const fs = require('fs');

function addCurrencyToUseCart(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("useCart();")) {
    if (!content.includes(" currency ")) {
      content = content.replace("} = useCart();", ", currency } = useCart();");
    }
  } else {
    // We need to add useCart entirely
    content = "import { useCart } from '../context/CartContext.tsx';\n" + content;
    // Inject it in the component body
    const fcMatch = content.match(/const [A-Za-z0-9_]+: React\.FC[^>]*> = \([^)]*\) => {/);
    if (fcMatch) {
      content = content.replace(fcMatch[0], fcMatch[0] + "\n  const { currency } = useCart();\n");
    } else {
        const fnMatch = content.match(/export function [A-Za-z0-9_]+\([^)]*\) {/);
        if (fnMatch) {
            content = content.replace(fnMatch[0], fnMatch[0] + "\n  const { currency } = useCart();\n");
        }
    }
  }
  fs.writeFileSync(file, content);
}

const files = [
  'src/components/CheckoutPage.tsx',
  'src/components/AIAssistantChat.tsx',
  'src/components/UserOrdersModal.tsx',
  'src/components/ShareModal.tsx',
];

files.forEach(addCurrencyToUseCart);
console.log("Currency extracted");
