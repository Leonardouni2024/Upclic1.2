import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { ReviewsProvider } from './context/ReviewsContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { ProductCategoriesSection } from './components/ProductCategoriesSection.tsx';
import { BenefitsSection } from './components/BenefitsSection.tsx';
import { FeaturedProductsSection } from './components/FeaturedProductsSection.tsx';
import { TrustSection } from './components/TrustSection.tsx';
import { TrustpilotReviewsSection } from './components/TrustpilotReviewsSection.tsx';
import { ProductGrid } from './components/ProductGrid.tsx';
import { ProductDetailPage } from './components/ProductDetailPage.tsx';
import { CheckoutPage } from './components/CheckoutPage.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { FloatingMobileCart } from './components/FloatingMobileCart.tsx';
import { WhatsAppButton } from './components/WhatsAppButton.tsx';
import { ToastContainer } from './components/Toast.tsx';
import { Footer } from './components/Footer.tsx';
import { HelpModal } from './components/HelpModal.tsx';

import { CartReminder } from './components/CartReminder.tsx';
import { UserOrdersModal } from './components/UserOrdersModal.tsx';
import { RegionLanguageModal } from './components/RegionLanguageModal.tsx';
import { DiscountPopup } from './components/DiscountPopup.tsx';

const AppContent: React.FC = () => {
  const { currentPath, currentProductSlug, activeCategory, isDiscountPopupOpen, handleDiscountPopupComplete } = useCart();
  const [helpTopic, setHelpTopic] = useState<string | null>(null);
  const [isUserOrdersModalOpen, setIsUserOrdersModalOpen] = useState(false);

  // Render main view based on current path
  const renderMainContent = () => {
    
    if (currentPath === '/checkout/success') {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center text-[#0B1F3A]">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-black text-[#0B1F3A] mb-2">¡Pago Exitoso!</h2>
          <p className="text-slate-600 mb-6 max-w-md">Tu pedido ha sido procesado correctamente. Recibirás tu clave de activación e instrucciones en tu correo y WhatsApp en un lapso de 5 a 15 minutos.</p>
          <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-[#0067B8] hover:bg-[#005499] text-white font-bold rounded-lg transition-colors shadow-sm cursor-pointer">
            Volver a la tienda
          </button>
        </div>
      );
    }

    if (currentPath === '/checkout') {
      return <CheckoutPage />;
    }

    if (currentPath.includes('/producto/') && currentProductSlug) {
      return <ProductDetailPage slug={currentProductSlug} />;
    }

    return (
      <main>
        {activeCategory === 'all' && (
          <>
            {/* 1. Página principal (Hero) */}
            <Hero />

            {/* 2. Categorías de productos */}
            <ProductCategoriesSection />

            {/* 3. Sección de beneficios */}
            <BenefitsSection />

            {/* 4. Productos destacados (Estilo ecommerce con WhatsApp) */}
            <FeaturedProductsSection />

            {/* 5. Sección de confianza */}
            <TrustSection />

            {/* 6. Reseñas y Valoraciones en Trustpilot */}
            <TrustpilotReviewsSection />
          </>
        )}
        {/* Catálogo completo y buscador */}
        <ProductGrid />
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

      {/* 5-Second Auto-Rotating Demonstrative Testimonial Widget */}
        <WhatsAppButton />

      {/* Cart Reminder Notification */}
      <CartReminder />

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
