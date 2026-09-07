const fs = require('fs');

let content = fs.readFileSync('src/products.ts', 'utf8');

// Insert at the top (after imports)
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

content = content.replace("export interface Product {", currencyDefs + "export interface Product {");

// Now let's update formatWhatsAppOrder and formatEmailOrder to accept currency
content = content.replace(
  "export function formatWhatsAppOrder(info: CustomerCheckoutInfo, totals: CartTotals): string {",
  "export function formatWhatsAppOrder(info: CustomerCheckoutInfo, totals: CartTotals, currency: Currency = 'PEN'): string {"
);

// We should replace S/ X with formatPrice(X, currency) inside those formatting functions.
// But it might be complex to regex properly inside the function body. 
// It might be easier to just leave the receipts in PEN for now, but the user requested "y en el metodo de pago tambien", which means Mercado Pago amounts and checkout display should be converted.
// If it's too much, let's just do it right.

fs.writeFileSync('src/products.ts', content);
console.log("Currency defs added to products.ts");
