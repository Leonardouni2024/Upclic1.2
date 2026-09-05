const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace("import { AdminOrdersModal } from './components/AdminOrdersModal.tsx';\n", "");
app = app.replace("  const [showAdminOrders, setShowAdminOrders] = useState(false);\n", "");
app = app.replace("        onOpenAdminOrders={() => setShowAdminOrders(true)}\n", "");

const search2 = "      {/* Admin Orders & Email Notifications Modal */}\n      <AdminOrdersModal isOpen={showAdminOrders} onClose={() => setShowAdminOrders(false)} />\n";
app = app.replace(search2, "");

fs.writeFileSync('src/App.tsx', app);
console.log("App fixed");
