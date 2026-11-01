import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { ReviewsProvider } from './context/ReviewsContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { BenefitsSection } from './components/BenefitsSection.tsx';
import { TrustSection } from './components/TrustSection.tsx';
import { ProductGrid } from './components/ProductGrid.tsx';
import { ProductDetailPage } from './components/ProductDetailPage.tsx';
import { CheckoutPage } from './components/CheckoutPage.tsx';
import { PayPalCheckoutPage } from './components/PayPalCheckoutPage.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { FloatingMobileCart } from './components/FloatingMobileCart.tsx';
import { WhatsAppButton } from './components/WhatsAppButton.tsx';
import { ToastContainer } from './components/Toast.tsx';
import { Footer } from './components/Footer.tsx';
import { HelpModal } from './components/HelpModal.tsx';
import { UserOrdersModal } from './components/UserOrdersModal.tsx';
import { RegionLanguageModal } from './components/RegionLanguageModal.tsx';
import { DiscountPopup } from './components/DiscountPopup.tsx';

const AppContent: React.FC = () => {
  const { currentPath, currentProductSlug, isDiscountPopupOpen, handleDiscountPopupComplete } = useCart();
  const [helpTopic, setHelpTopic] = useState<string | null>(null);
  const [isUserOrdersModalOpen, setIsUserOrdersModalOpen] = useState(false);

  // Render main view based on current path
  const renderMainContent = () => {
    if (currentPath === '/checkout/paypal' || currentPath === '/paypal') {
      return <PayPalCheckoutPage />;
    }

    if (currentPath === '/checkout' || currentPath === '/checkout/success') {
      return <CheckoutPage />;
    }

    if (currentPath.includes('/producto/') && currentProductSlug) {
      return <ProductDetailPage slug={currentProductSlug} />;
    }

    return (
      <main className="bg-[#F4F7FB]">
        {/* 1. HERO SECTION */}
        <Hero />

        {/* 2. CATÁLOGO COMPLETO DE SOFTWARE Y CUENTAS PREMIUM */}
        <ProductGrid />

        {/* 3. PROCESO EN 3 PASOS */}
        <BenefitsSection />

        {/* 4. SECCIÓN DE CONFIANZA, PAGOS SEGUROS Y FAQ ACORDEÓN */}
        <TrustSection />
      </main>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-700 font-sans">
      {/* Sticky Header with Navigation, Live Search and Cart Counter */}
      <Header onOpenUserOrders={() => setIsUserOrdersModalOpen(true)} />

      {/* Dynamic View Content */}
      <div className="flex-1">
        {renderMainContent()}
      </div>

      {/* Footer with UpClic branding, navigation links and payment badges */}
      <Footer
        onOpenHelpModal={(topic) => setHelpTopic(topic)}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer />

      {/* Mobile Floating Cart Pill at bottom */}
      <FloatingMobileCart />

      {/* WhatsApp Support Floating Button */}
      <WhatsAppButton />

      {/* Real-time Toast Notifications */}
      <ToastContainer />

      {/* 7-Second Animated 10% Discount Popup */}
      <DiscountPopup
        isOpen={isDiscountPopupOpen}
        onComplete={handleDiscountPopupComplete}
      />

      {/* Help, FAQs & Legal Modal */}
      <HelpModal topic={helpTopic} onClose={() => setHelpTopic(null)} />

      <UserOrdersModal isOpen={isUserOrdersModalOpen} onClose={() => setIsUserOrdersModalOpen(false)} />
      <RegionLanguageModal />
    </div>
  );
};

export default function App() {
  return (
    <ReviewsProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ReviewsProvider>
  );
}
