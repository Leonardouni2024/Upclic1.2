const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix broken syntax in CheckoutPage and AIAssistantChat
  content = content.replace("  , currency } = useCart();", "} = useCart();");
  content = content.replace(" addItem , currency } = useCart();", " addItem } = useCart();");

  // Actually, we DO want currency.
  // If it's already extracted properly, great. If not:
  
  fs.writeFileSync(file, content);
}

fixFile('src/components/CheckoutPage.tsx');
fixFile('src/components/AIAssistantChat.tsx');

console.log("Fixed broken syntax");
