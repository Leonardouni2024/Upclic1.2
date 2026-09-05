const fs = require('fs');
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!header.includes('onOpenUserOrders')) {
  // Update props interface
  header = header.replace(
    "interface HeaderProps {\n  setIsCartOpen: (open: boolean) => void;\n  setIsHelpModalOpen: (open: boolean) => void;\n}",
    "interface HeaderProps {\n  setIsCartOpen: (open: boolean) => void;\n  setIsHelpModalOpen: (open: boolean) => void;\n  onOpenUserOrders?: () => void;\n}"
  );
  
  // Update component definition
  header = header.replace(
    "export const Header: React.FC<HeaderProps> = ({ setIsCartOpen, setIsHelpModalOpen }) => {",
    "export const Header: React.FC<HeaderProps> = ({ setIsCartOpen, setIsHelpModalOpen, onOpenUserOrders }) => {"
  );
  
  // Add User icon import
  header = header.replace(
    "import { Search, Menu, X, Star, ArrowRight, Sparkles, Layers, ShoppingCart } from 'lucide-react';",
    "import { Search, Menu, X, Star, ArrowRight, Sparkles, Layers, ShoppingCart, User } from 'lucide-react';"
  );
  
  // Add button next to Cart
  const cartBtnStr = `<button
              id="cart-header-btn"`;
              
  const userBtnStr = `{/* User Orders Button */}
            <button
              onClick={() => onOpenUserOrders && onOpenUserOrders()}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#0066FF] transition-colors cursor-pointer hidden sm:block"
              title="Mis Pedidos"
            >
              <User className="w-5 h-5" />
            </button>

            `;
            
  header = header.replace(cartBtnStr, userBtnStr + cartBtnStr);
  
  fs.writeFileSync('src/components/Header.tsx', header);
  console.log("Header.tsx updated");
} else {
  console.log("Header already updated");
}
