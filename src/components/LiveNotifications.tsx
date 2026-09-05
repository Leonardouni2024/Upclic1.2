import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, BellRing, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

// Sound effect for notifications
const playNotificationSound = () => {
  try {
    // Simple Web Audio API beep for notification
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // A6
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.log("Audio not supported or blocked");
  }
};

const fakePurchases = [
  { name: 'Carlos M.', product: 'Office Professional Plus 2021', location: 'Lima' },
  { name: 'Andrea V.', product: 'Windows 11 Pro', location: 'Arequipa' },
  { name: 'Luis J.', product: 'Microsoft Project 2024', location: 'Cusco' },
  { name: 'Diana R.', product: 'Microsoft Visio 2021', location: 'Trujillo' },
  { name: 'Miguel A.', product: 'Office Standard 2021', location: 'Piura' },
  { name: 'Rosa P.', product: 'Combo Windows 10 + Office', location: 'Chiclayo' }
];

export const LiveNotifications: React.FC = () => {
  const [purchaseNotif, setPurchaseNotif] = useState<any | null>(null);
  const [offerNotif, setOfferNotif] = useState<any | null>(null);
  const { products } = useCart();
  
  // Purchase notification logic
  useEffect(() => {
    // Show first one after 30 seconds
    const initialTimer = setTimeout(() => {
      showRandomPurchase();
    }, 30000);
    
    // Then every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
      showRandomPurchase();
    }, 300000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);
  
  // Smart Offer logic based on localStorage viewing history
  useEffect(() => {
    const offerTimer = setTimeout(() => {
      try {
        const viewed = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
        if (viewed.length > 0) {
          const lastViewedId = viewed[viewed.length - 1];
          const product = products.find(p => p.id === lastViewedId);
          if (product && product.price > 20) {
            setOfferNotif({
              title: 'Oferta Especial para ti 🎁',
              message: `Lleva ${product.name} con un 10% de descuento al agregar otro producto a tu carrito.`,
              productName: product.name
            });
            playNotificationSound();
            
            // Try to trigger browser notification if permitted
            if (Notification.permission === 'granted') {
              new Notification('Oferta Especial', {
                body: `Lleva ${product.name} con 10% adicional.`,
                icon: '/favicon.ico'
              });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission();
            }
          }
        }
      } catch (e) {}
    }, 60000); // Check 1 minute after load
    
    return () => clearTimeout(offerTimer);
  }, [products]);

  const showRandomPurchase = () => {
    const random = fakePurchases[Math.floor(Math.random() * fakePurchases.length)];
    setPurchaseNotif(random);
    playNotificationSound();
    
    // Auto hide after 6 seconds
    setTimeout(() => {
      setPurchaseNotif(null);
    }, 60000); // Wait user wants it a bit longer maybe? let's do 8 seconds
  };

  useEffect(() => {
    if (purchaseNotif) {
      const t = setTimeout(() => setPurchaseNotif(null), 8000);
      return () => clearTimeout(t);
    }
  }, [purchaseNotif]);
  
  useEffect(() => {
    if (offerNotif) {
      const t = setTimeout(() => setOfferNotif(null), 12000);
      return () => clearTimeout(t);
    }
  }, [offerNotif]);

  return (
    <div className="fixed bottom-4 left-4 z-[90] flex flex-col gap-3 pointer-events-none">
      
      {/* Smart Offer Notification */}
      {offerNotif && (
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-blue-200 w-80 pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-indigo-500"></div>
          <button 
            onClick={() => setOfferNotif(null)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start gap-3 mt-1">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">{offerNotif.title}</p>
              <p className="text-sm text-slate-700 font-medium leading-tight mt-1">
                {offerNotif.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Purchase Notification */}
      {purchaseNotif && (
        <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-3 w-72 pointer-events-auto animate-in slide-in-from-left-5 fade-in duration-300">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100 relative">
            <ShoppingBag className="w-5 h-5 text-green-600" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 pr-4">
            <p className="text-[11px] text-slate-500 font-medium">Alguien acaba de comprar</p>
            <p className="text-xs font-bold text-slate-800 line-clamp-1">{purchaseNotif.product}</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <span>{purchaseNotif.name}</span>
              <span>•</span>
              <span>Desde {purchaseNotif.location}</span>
            </p>
          </div>
          <button 
            onClick={() => setPurchaseNotif(null)}
            className="absolute top-2 right-2 text-slate-300 hover:text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
