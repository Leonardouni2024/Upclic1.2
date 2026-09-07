const fs = require('fs');

function revertProductsTs() {
  const file = 'src/products.ts';
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove Currency types and exchange rate
  content = content.replace(/export type Currency = 'PEN' \| 'USD';\n/g, '');
  content = content.replace(/export const EXCHANGE_RATE = 3\.75; \/\/ 1 USD = 3\.75 PEN\n/g, '');
  content = content.replace(/, Currency } from '\.\.\/products\.ts'/g, " } from '../products.ts'");
  content = content.replace(/, Currency/g, "");

  // Revert formatPrice
  const formatPriceRegex = /export function formatPrice\(priceInPEN: number, currency: Currency = 'PEN'\): string \{\s*if \(currency === 'USD'\) \{\s*return `\$ \$\{\(priceInPEN \/ EXCHANGE_RATE\)\.toFixed\(2\)\}`;\s*\}\s*return `S\/ \$\{priceInPEN\.toFixed\(2\)\}`;\s*\}/g;
  content = content.replace(formatPriceRegex, `export function formatPrice(priceInPEN: number): string {\n  return \`S/ \${priceInPEN.toFixed(2)}\`;\n}`);

  // Revert formatPriceNoSymbol
  const formatPriceNoSymbolRegex = /export function formatPriceNoSymbol\(priceInPEN: number, currency: Currency = 'PEN'\): string \{\s*if \(currency === 'USD'\) \{\s*return \(priceInPEN \/ EXCHANGE_RATE\)\.toFixed\(2\);\s*\}\s*return priceInPEN\.toFixed\(2\);\s*\}/g;
  content = content.replace(formatPriceNoSymbolRegex, `export function formatPriceNoSymbol(priceInPEN: number): string {\n  return priceInPEN.toFixed(2);\n}`);

  // Remove getCurrencySymbol
  const getCurrencySymbolRegex = /export function getCurrencySymbol\(currency: Currency = 'PEN'\): string \{\s*return currency === 'USD' \? '\$' : 'S\/';\s*\}/g;
  content = content.replace(getCurrencySymbolRegex, '');
  
  fs.writeFileSync(file, content);
}

function revertCartContext() {
  const file = 'src/context/CartContext.tsx';
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/currency: Currency;\n\s*setCurrency: \(c: Currency\) => void;\n/g, '');
  content = content.replace(/const \[currency, setCurrency\] = useState<Currency>\('PEN'\);\n/g, '');
  content = content.replace(/\s*currency,\n\s*setCurrency,\n/g, '\n');
  content = content.replace(/, Currency/g, '');
  
  fs.writeFileSync(file, content);
}

function revertComponents() {
  const dir = 'src/components/';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => dir + f);
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove from formatPrice calls
    content = content.replace(/formatPrice\(([^,]+),\s*currency\)/g, 'formatPrice($1)');
    content = content.replace(/formatPriceNoSymbol\(([^,]+),\s*currency\)/g, 'formatPriceNoSymbol($1)');
    
    // Remove from useCart destructuring
    content = content.replace(/,\s*currency/g, '');
    content = content.replace(/currency,\s*/g, '');
    content = content.replace(/setCurrency,\s*/g, '');
    
    fs.writeFileSync(file, content);
  });
}

try {
  revertProductsTs();
  revertCartContext();
  revertComponents();
  console.log("Revert successful");
} catch (e) {
  console.error("Revert failed", e);
}
