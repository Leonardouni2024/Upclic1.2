const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes('isUserOrdersModalOpen')) {
  app = app.replace(
    "const [showAdminOrders, setShowAdminOrders] = useState(false);",
    "const [showAdminOrders, setShowAdminOrders] = useState(false);\n  const [isUserOrdersModalOpen, setIsUserOrdersModalOpen] = useState(false);"
  );
  
  app = app.replace(
    "<AdminOrdersModal isOpen={showAdminOrders} onClose={() => setShowAdminOrders(false)} />",
    "<AdminOrdersModal isOpen={showAdminOrders} onClose={() => setShowAdminOrders(false)} />\n        <UserOrdersModal isOpen={isUserOrdersModalOpen} onClose={() => setIsUserOrdersModalOpen(false)} />"
  );
  
  fs.writeFileSync('src/App.tsx', app);
}
console.log("App state fixed");
