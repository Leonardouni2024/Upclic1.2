const fs = require('fs');

let content = fs.readFileSync('src/products.ts', 'utf8');
const startProducts = content.indexOf('export const products: Product[] = [');

const newTop = `import type { Product, CartTotals } from './types.ts';

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

export const WHATSAPP_NUMBER = "51983204384";
export const WHATSAPP_DISPLAY = "+51 983 204 384";

export const MULTI_ITEM_DISCOUNT = 0.10; // 10% si lleva 2 o más productos
export const MERCADO_PAGO_URL = "https://link.mercadopago.com.pe/iptvfuxionpago";

`;

content = newTop + content.substring(startProducts);
content = content.replace(/ : 'S\/';\n\}/g, "");
content = content.replace(/ \: 'S\/';\n\}/g, "");

fs.writeFileSync('src/products.ts', content);
