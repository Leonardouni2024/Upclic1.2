import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { BenefitsSection } from './components/BenefitsSection';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailPage } from './components/ProductDetailPage';
import { HelpModal } from './components/HelpModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CheckoutPage } from './components/CheckoutPage';
import { UserOrdersModal } from './components/UserOrdersModal';
import { AdminPanel } from './components/AdminPanel';

const StoreContent: React.FC = () => {
  const { selectedProduct, setSelectedProduct, currentView } = useCart();

  if (currentView === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-[#1668E3] selection:text-white">
      <Header />
      <main className="flex-grow">
        {currentView === 'checkout' ? (
          <CheckoutPage />
        ) : currentView === 'product' && selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
          />
        ) : (
          <>
            <Hero />
            <ProductGrid />
            <BenefitsSection />
            <TrustSection />
          </>
        )}
      </main>
      <Footer />
      <CartDrawer />
      <HelpModal />
      <UserOrdersModal />
      <WhatsAppButton />
    </div>
  );
};

export function App() {
  return (
    <CartProvider>
      <StoreContent />
    </CartProvider>
  );
}

export default App;
