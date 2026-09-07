const fs = require('fs');

let content = fs.readFileSync('src/products.ts', 'utf8');

const currencyDefs = `
export type Currency = 'PEN' | 'USD';
export const EXCHANGE_RATE = 3.75; // 1 USD = 3.75 PEN

export function formatPrice(priceInPEN: number, currency: Currency = 'PEN'): string {
  if (currency === 'USD') {
    return \`$ \${(priceInPEN / EXCHANGE_RATE).toFixed(2)}\`;
  }
  return \`S/ \${priceInPEN.toFixed(2)}\`;
}

export function formatPriceNoSymbol(priceInPEN: number, currency: Currency = 'PEN'): string {
  if (currency === 'USD') {
    return (priceInPEN / EXCHANGE_RATE).toFixed(2);
  }
  return priceInPEN.toFixed(2);
}

export function getCurrencySymbol(currency: Currency = 'PEN'): string {
  return currency === 'USD' ? '$' : 'S/';
}
`;

content = content.replace("export const WHATSAPP_NUMBER", currencyDefs + "\nexport const WHATSAPP_NUMBER");

fs.writeFileSync('src/products.ts', content);
console.log("products.ts currency fixed");
