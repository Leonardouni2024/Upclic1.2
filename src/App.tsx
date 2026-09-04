import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { ReviewsProvider } from './context/ReviewsContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { BestSellersCarousel } from './components/BestSellersCarousel.tsx';
import { TopProductsSection } from './components/TopProductsSection.tsx';
import { ProductGrid } from './components/ProductGrid.tsx';
import { HowToBuySection } from './components/HowToBuySection.tsx';
import { ProductDetailPage } from './components/ProductDetailPage.tsx';
import { CheckoutPage } from './components/CheckoutPage.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { FloatingMobileCart } from './components/FloatingMobileCart.tsx';
import { FloatingTestimonials } from './components/FloatingTestimonials.tsx';
import { ToastContainer } from './components/Toast.tsx';
import { Footer } from './components/Footer.tsx';
import { HelpModal } from './components/HelpModal.tsx';
import { AIAssistantChat } from './components/AIAssistantChat.tsx';
import { CartReminder } from './components/CartReminder.tsx';

const AppContent: React.FC = () => {
  const { currentPath, currentProductSlug } = useCart();
  const [helpTopic, setHelpTopic] = useState<string | null>(null);

  // Render main view based on current path
  const renderMainContent = () => {
    
    if (currentPath === '/checkout/success') {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">¡Pago Exitoso!</h2>
          <p className="text-slate-600 mb-6 max-w-md">Tu pedido ha sido procesado correctamente. Recibirás tu licencia y las instrucciones por correo y WhatsApp en unos instantes.</p>
          <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-[#0066FF] text-white rounded-xl font-bold hover:bg-[#0052cc] transition-colors">
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

        {/* 5-Step Visual Buying Guide: ¿Cómo comprar? */}
        <HowToBuySection />
      </main>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sticky Header with Navigation, Live Search and Cart Counter */}
      <Header />

      {/* Dynamic View Content */}
      <div className="flex-1">
        {renderMainContent()}
      </div>

      {/* Footer with UpClic branding, navigation links and payment badges */}
      <Footer onOpenHelpModal={(topic) => setHelpTopic(topic)} />

      {/* Shopping Cart Drawer */}
      <CartDrawer />

      {/* Mobile Floating Cart Pill at bottom */}
      <FloatingMobileCart />

      {/* 5-Second Auto-Rotating Demonstrative Testimonial Widget */}
      <FloatingTestimonials />

      {/* Cart Reminder Notification */}
      <CartReminder />

      {/* Real-time Toast Notifications */}
      <ToastContainer />

      {/* Help, FAQs & Legal Modal */}
      <HelpModal topic={helpTopic} onClose={() => setHelpTopic(null)} />

      {/* Intelligent AI Support & Recommendation Chatbot */}
      <AIAssistantChat />
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
