const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!app.includes('UserOrdersModal')) {
  app = app.replace(
    "import { AdminOrdersModal } from './components/AdminOrdersModal.tsx';",
    "import { AdminOrdersModal } from './components/AdminOrdersModal.tsx';\nimport { UserOrdersModal } from './components/UserOrdersModal.tsx';"
  );
  
  // Add state
  app = app.replace(
    "const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);",
    "const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);\n  const [isUserOrdersModalOpen, setIsUserOrdersModalOpen] = useState(false);"
  );
  
  // Add props to Header
  app = app.replace(
    "<Header setIsCartOpen={setIsCartOpen} setIsHelpModalOpen={setIsHelpModalOpen} />",
    "<Header setIsCartOpen={setIsCartOpen} setIsHelpModalOpen={setIsHelpModalOpen} onOpenUserOrders={() => setIsUserOrdersModalOpen(true)} />"
  );
  
  // Add component
  app = app.replace(
    "<AdminOrdersModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />",
    "<AdminOrdersModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />\n        <UserOrdersModal isOpen={isUserOrdersModalOpen} onClose={() => setIsUserOrdersModalOpen(false)} />"
  );
  
  fs.writeFileSync('src/App.tsx', app);
  console.log("App.tsx updated");
} else {
  console.log("UserOrdersModal already imported in App.tsx");
}
