const fs = require('fs');

let file = 'src/components/CheckoutPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "• <strong>Mercado Pago:</strong> Procesa tu pago seguro con tarjeta (crédito/débito), Yape o efectivo. Se emite tu comprobante de inmediato.",
  "• <strong>Mercado Pago:</strong> Procesa tu pago seguro con tarjeta (crédito/débito) o métodos locales. Se emite tu comprobante de inmediato."
);

content = content.replace(
  "<span>Pasarela 100% segura (Tarjetas, Yape, PagoEfectivo)</span>",
  "<span>Pasarela 100% segura (Tarjetas y métodos locales)</span>"
);

fs.writeFileSync(file, content);
console.log("Checkout Yape text fixed");
