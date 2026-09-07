const fs = require('fs');
let file = 'src/components/HelpModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { useCart } from '../context/CartContext.tsx';")) {
  content = content.replace("import React from 'react';", "import React from 'react';\nimport { useCart } from '../context/CartContext.tsx';");
}

fs.writeFileSync(file, content);
