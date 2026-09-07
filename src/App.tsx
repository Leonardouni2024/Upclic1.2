import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { ReviewsProvider } from './context/ReviewsContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { BestSellersCarousel } from './components/BestSellersCarousel.tsx';
import { TopProductsSection } from './components/TopProductsSection.tsx';
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

const AppContent: React.FC = () => {
  const { currentPath, currentProductSlug } = useCart();
  const [helpTopic, setHelpTopic] = useState<string | null>(null);
  const [isUserOrdersModalOpen, setIsUserOrdersModalOpen] = useState(false);

  // Render main view based on current path
  const renderMainContent = () => {
    
    if (currentPath === '/checkout/success') {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">¡Pago Exitoso!</h2>
          <p className="text-purple-200 mb-6 max-w-md">Tu pedido ha sido procesado correctamente. Recibirás tu licencia y las instrucciones por correo y WhatsApp en unos instantes.</p>
          <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black rounded-xl transition-colors shadow-lg cursor-pointer">
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
        {/* Main Hero Section with Call-To-Action & Trust Badges */}
        <Hero />

        {/* Carousel: Más Vendidos (Office 2024, 2021, Windows 11 Pro, M365) */}
        <BestSellersCarousel />

        {/* Section: Los más buscados (Top Featured Products with Big Cards) */}
        <TopProductsSection />

        {/* Complete Catalog Grid with Live Search & Category Filtering */}
        <ProductGrid />
      </main>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#100c22] text-white font-['Plus_Jakarta_Sans',sans-serif]">
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

      {/* Help, FAQs & Legal Modal */}
      <HelpModal topic={helpTopic} onClose={() => setHelpTopic(null)} />

        <UserOrdersModal isOpen={isUserOrdersModalOpen} onClose={() => setIsUserOrdersModalOpen(false)} />

      {/* Intelligent AI Support & Recommendation Chatbot */}

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
