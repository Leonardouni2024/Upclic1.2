const fs = require('fs');
let content = fs.readFileSync('src/components/ProductDetailPage.tsx', 'utf8');

// Add state for scarcity
const stateHook = `  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [showScarcity, setShowScarcity] = useState<{ show: boolean, count: number }>({ show: false, count: 0 });

  useEffect(() => {
    // Generate scarcity badge after 15-20 seconds on the page
    const timer = setTimeout(() => {
      // Random count between 2 and 6
      const randomCount = Math.floor(Math.random() * 5) + 2;
      setShowScarcity({ show: true, count: randomCount });
    }, 15000);
    return () => clearTimeout(timer);
  }, []);
`;

content = content.replace("  const [selectedVariant, setSelectedVariant] = useState<string>('');", stateHook);

// Replace scarcity badge HTML
const targetBadge = `<div className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                      ¡Date prisa! Quedan solo 3 licencias a este precio.
                    </div>`;
                    
const replaceBadge = `{showScarcity.show && (
                      <div className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                        ¡Date prisa! Quedan solo {showScarcity.count} licencias a este precio.
                      </div>
                    )}`;

content = content.replace(targetBadge, replaceBadge);

fs.writeFileSync('src/components/ProductDetailPage.tsx', content);
console.log("Scarcity fixed");
