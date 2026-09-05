const fs = require('fs');
let content = fs.readFileSync('src/components/ProductDetailPage.tsx', 'utf8');

const targetState = `  const [selectedVariantId, setSelectedVariantId] = useState<'oem' | 'retail'>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : 'oem'
  );`;

const replacementState = `  const [selectedVariantId, setSelectedVariantId] = useState<'oem' | 'retail'>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : 'oem'
  );
  
  const [showScarcity, setShowScarcity] = useState<{ show: boolean, count: number }>({ show: false, count: 0 });

  useEffect(() => {
    // Generate scarcity badge after 15-20 seconds on the page
    const timer = setTimeout(() => {
      // Random count between 2 and 6
      const randomCount = Math.floor(Math.random() * 5) + 2;
      setShowScarcity({ show: true, count: randomCount });
    }, 15000);
    return () => clearTimeout(timer);
  }, [product.id]);`; // trigger on product change

content = content.replace(targetState, replacementState);

fs.writeFileSync('src/components/ProductDetailPage.tsx', content);
console.log("Scarcity state fixed");
