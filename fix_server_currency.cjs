const fs = require('fs');

const serverFile = 'server.ts';
let serverContent = fs.readFileSync(serverFile, 'utf8');

serverContent = serverContent.replace(/, currency = 'PEN'/g, '');
serverContent = serverContent.replace(/currency_id: currency,/g, 'currency_id: "PEN",');
serverContent = serverContent.replace(/total: currency === 'USD' \? Number\(\(finalTotal \/ EXCHANGE_RATE\)\.toFixed\(2\)\) : finalTotal,/g, 'total: finalTotal,');
serverContent = serverContent.replace(/unitPrice: currency === 'USD' \? Number\(\(\(it\.unitPrice \|\| it\.product\?\.price \|\| it\.price \|\| 0\) \/ EXCHANGE_RATE\)\.toFixed\(2\)\) : \(it\.unitPrice \|\| it\.product\?\.price \|\| it\.price \|\| 0\),/g, 'unitPrice: it.unitPrice || it.product?.price || it.price || 0,');

fs.writeFileSync(serverFile, serverContent);
