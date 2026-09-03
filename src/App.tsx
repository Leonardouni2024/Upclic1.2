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
import { UserModal } from './components/UserModal.tsx';
import { HelpModal } from './components/HelpModal.tsx';
import { AIAssistantChat } from './components/AIAssistantChat.tsx';

const AppContent: React.FC = () => {
  const { currentPath, currentProductSlug } = useCart();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [helpTopic, setHelpTopic] = useState<string | null>(null);

  // Render main view based on current path
  const renderMainContent = () => {
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
      <Header onOpenUserModal={() => setIsUserModalOpen(true)} />

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

      {/* Real-time Toast Notifications */}
      <ToastContainer />

      {/* Customer User Account and License Portal Modal */}
      <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />

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
