const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

const lookupEndpoint = `
// Endpoint for users to lookup their orders
app.get("/api/orders/lookup", (req, res) => {
  const email = req.query.email?.toString().toLowerCase().trim();
  const orderId = req.query.id?.toString().trim();
  
  if (!email && !orderId) {
    return res.status(400).json({ success: false, message: "Provide email or order ID" });
  }

  const orders = loadStoredOrders();
  const matchedOrders = orders.filter(o => {
    let match = false;
    if (email && o.customerEmail && o.customerEmail.toLowerCase() === email) match = true;
    if (orderId && o.id === orderId) match = true;
    if (orderId && o.paymentId === orderId) match = true;
    return match;
  });

  res.json({
    success: true,
    orders: matchedOrders
  });
});
`;

if (!server.includes('/api/orders/lookup')) {
  server = server.replace('app.get("/api/orders",', lookupEndpoint + '\napp.get("/api/orders",');
  fs.writeFileSync('server.ts', server);
  console.log("Added lookup endpoint");
} else {
  console.log("Lookup endpoint already exists");
}
