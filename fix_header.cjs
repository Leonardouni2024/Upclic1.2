const fs = require('fs');
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

header = header.replace(
  "interface HeaderProps {}",
  "interface HeaderProps { onOpenUserOrders?: () => void; setIsCartOpen?: (open: boolean) => void; setIsHelpModalOpen?: (open: boolean) => void; }"
);

header = header.replace(
  "export const Header: React.FC<HeaderProps> = () => {",
  "export const Header: React.FC<HeaderProps> = ({ onOpenUserOrders }) => {"
);

fs.writeFileSync('src/components/Header.tsx', header);
console.log("Header fixed");
