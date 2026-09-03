import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ProductCategory, CartTotals } from '../types.ts';
import { calculateCartTotals, PROMO_COUPON_CODE, PROMO_COUPON_EXPIRATION_DAYS, MIN_PRICE_FOR_COUPON } from '../products.ts';

interface ToastData {
  id: string;
  type: 'added' | 'discount' | 'info' | 'coupon';
  title: string;
  message?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedVariant?: 'oem' | 'retail') => void;
  removeItem: (itemKeyOrProductId: string, variantId?: string) => void;
  updateQuantity: (itemKeyOrProductId: string, delta: number, variantId?: string) => void;
  setQuantity: (itemKeyOrProductId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  // Totals & Discount details
  totalQuantity: number;
  subtotal: number;
  hasDiscount: boolean;
  discountRate: number;
  discountAmount: number;
  total: number;
  discountReason?: string;
  isMultiItemDiscount: boolean;
  isCouponApplied: boolean;
  // Promo Coupon System
  appliedCoupon: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  couponFeedback: { type: 'success' | 'error' | 'info'; message: string } | null;
  toasts: ToastData[];
  removeToast: (id: string) => void;
  // Navigation & Filtering
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigateToProduct: (slug: string) => void;
  navigateToHome: () => void;
  navigateToCheckout: () => void;
  currentPath: string;
  currentProductSlug?: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'upclic_cart_v1';
const COUPON_STORAGE_KEY = 'upclic_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string>(() => {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/producto/') || path === '/checkout') {
        return path;
      }
      if (window.location.hash.startsWith('#/producto/')) {
        return window.location.hash.replace('#', '');
      }
      if (window.location.hash === '#/checkout') {
        return '/checkout';
      }
    }
    return '/';
  });

  // Keep localStorage updated for cart
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [items]);

  // Keep localStorage updated for coupon
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, appliedCoupon);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/producto/') || path === '/checkout') {
        setCurrentPath(path);
      } else if (window.location.hash.startsWith('#/producto/')) {
        setCurrentPath(window.location.hash.replace('#', ''));
      } else if (window.location.hash === '#/checkout') {
        setCurrentPath('/checkout');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-3), { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      const msg = 'Por favor ingresa un código promocional.';
      setCouponFeedback({ type: 'error', message: msg });
      return { success: false, message: msg };
    }

    if (clean === PROMO_COUPON_CODE) {
      setAppliedCoupon(PROMO_COUPON_CODE);
      const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

      let msg = '';
      if (totalQty >= 2) {
        msg = 'Código PRIMUPCLIC activado. ¡Por llevar 2 o más productos tienes el 10% de descuento aplicado! (Los descuentos no son combinables)';
        setCouponFeedback({ type: 'info', message: msg });
        addToast({
          type: 'coupon',
          title: '✓ Código PRIMUPCLIC reconocido',
          message: 'Descuento del 10% aplicado por 2 o más productos (No combinable).'
        });
      } else {
        const eligibleItems = items.filter(item => (item.unitPrice ?? item.product.price) >= MIN_PRICE_FOR_COUPON);
        if (items.length > 0 && eligibleItems.length === 0) {
          msg = `Cupón PRIMUPCLIC reconocido, pero solo aplica a productos con precio desde S/ ${MIN_PRICE_FOR_COUPON.toFixed(2)}.`;
          setCouponFeedback({ type: 'error', message: msg });
          addToast({
            type: 'info',
            title: 'Aviso de Cupón',
            message: `El 10% de descuento solo aplica a productos desde S/ ${MIN_PRICE_FOR_COUPON.toFixed(2)}.`
          });
        } else {
          msg = `¡Código PRIMUPCLIC aplicado! 10% de descuento en productos desde S/ ${MIN_PRICE_FOR_COUPON.toFixed(2)} (válido por ${PROMO_COUPON_EXPIRATION_DAYS} días).`;
          setCouponFeedback({ type: 'success', message: msg });
          addToast({
            type: 'coupon',
            title: '🎉 ¡Cupón PRIMUPCLIC aplicado!',
            message: `10% de descuento en productos desde S/ ${MIN_PRICE_FOR_COUPON.toFixed(2)}.`
          });
        }
      }
      return { success: true, message: msg };
    } else {
      const msg = `El código "${code}" no es válido. Prueba con el cupón de apertura: PRIMUPCLIC`;
      setCouponFeedback({ type: 'error', message: msg });
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setCouponFeedback(null);
    addToast({
      type: 'info',
      title: 'Cupón removido',
      message: 'Se ha quitado el código promocional.'
    });
  };

  const getItemKey = (productId: string, variantId?: string) => {
    return variantId ? `${productId}-${variantId}` : productId;
  };

  const addItem = (product: Product, quantity: number = 1, selectedVariant?: 'oem' | 'retail') => {
    // Automatically open the cart drawer when adding a product as requested
    setIsCartOpen(true);

    const variant = product.variants
      ? (product.variants.find(v => v.id === selectedVariant) || product.variants[0])
      : undefined;

    const variantKey = variant ? variant.id : undefined;
    const itemKey = getItemKey(product.id, variantKey);
    const itemPrice = variant ? variant.price : product.price;
    const variantName = variant ? variant.name : undefined;

    setItems(prevItems => {
      const prevQty = prevItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalQty = prevQty + quantity;

      const existingIndex = prevItems.findIndex(
        item => (item.id === itemKey) || (!item.id && item.product.id === product.id && item.selectedVariant === variantKey)
      );
      let updated: CartItem[];

      if (existingIndex > -1) {
        updated = prevItems.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [
          ...prevItems,
          {
            id: itemKey,
            product,
            quantity,
            selectedVariant: variantKey,
            variantName,
            unitPrice: itemPrice
          }
        ];
      }

      // Add success toast
      addToast({
        type: 'added',
        title: '✓ Producto agregado al carrito',
        message: `${product.name}${variantName ? ` (${variantName})` : ''} (${quantity > 1 ? `${quantity} uds.` : '1 ud.'})`
      });

      // If user crossed from 1 to >= 2, celebrate 10% discount!
      if (prevQty < 2 && newTotalQty >= 2) {
        setTimeout(() => {
          addToast({
            type: 'discount',
            title: '🔥 ¡10% de descuento aplicado!',
            message: 'Ahorras 10% automáticamente por llevar 2 o más productos (descuentos no combinables)'
          });
        }, 300);
      }

      return updated;
    });
  };

  const removeItem = (itemKeyOrProductId: string, variantId?: string) => {
    setItems(prev => {
      const target = prev.find(item => {
        const itemKey = item.id || getItemKey(item.product.id, item.selectedVariant);
        if (itemKey === itemKeyOrProductId || item.id === itemKeyOrProductId) return true;
        if (variantId) {
          return item.product.id === itemKeyOrProductId && item.selectedVariant === variantId;
        }
        return item.product.id === itemKeyOrProductId;
      });

      if (target) {
        addToast({
          type: 'info',
          title: 'Producto eliminado',
          message: `${target.product.name}${target.variantName ? ` (${target.variantName})` : ''} fue retirado del carrito`
        });
      }

      return prev.filter(item => {
        const itemKey = item.id || getItemKey(item.product.id, item.selectedVariant);
        if (itemKey === itemKeyOrProductId || item.id === itemKeyOrProductId) return false;
        if (variantId) {
          return !(item.product.id === itemKeyOrProductId && item.selectedVariant === variantId);
        }
        return item.product.id !== itemKeyOrProductId;
      });
    });
  };

  const updateQuantity = (itemKeyOrProductId: string, delta: number, variantId?: string) => {
    setItems(prev => {
      const prevQty = prev.reduce((sum, item) => sum + item.quantity, 0);
      let removedName = '';

      const updated = prev
        .map(item => {
          const itemKey = item.id || getItemKey(item.product.id, item.selectedVariant);
          const isMatch =
            itemKey === itemKeyOrProductId ||
            item.id === itemKeyOrProductId ||
            (variantId
              ? item.product.id === itemKeyOrProductId && item.selectedVariant === variantId
              : item.product.id === itemKeyOrProductId);

          if (isMatch) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) {
              removedName = `${item.product.name}${item.variantName ? ` (${item.variantName})` : ''}`;
              return null;
            }
            return { ...item, quantity: Math.min(99, newQty) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      if (removedName) {
        addToast({
          type: 'info',
          title: 'Producto eliminado',
          message: `${removedName} fue retirado del carrito`
        });
      }

      const newTotalQty = updated.reduce((sum, item) => sum + item.quantity, 0);
      if (prevQty < 2 && newTotalQty >= 2) {
        addToast({
          type: 'discount',
          title: '🔥 ¡10% de descuento aplicado!',
          message: 'Ahorras 10% automáticamente por llevar 2 o más productos'
        });
      }

      return updated;
    });
  };

  const setQuantity = (itemKeyOrProductId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(itemKeyOrProductId, variantId);
      return;
    }

    const validQty = Math.min(99, Math.max(1, Math.floor(quantity)));

    setItems(prev => {
      const prevQty = prev.reduce((sum, item) => sum + item.quantity, 0);
      const updated = prev.map(item => {
        const itemKey = item.id || getItemKey(item.product.id, item.selectedVariant);
        const isMatch =
          itemKey === itemKeyOrProductId ||
          item.id === itemKeyOrProductId ||
          (variantId
            ? item.product.id === itemKeyOrProductId && item.selectedVariant === variantId
            : item.product.id === itemKeyOrProductId);

        return isMatch ? { ...item, quantity: validQty } : item;
      });

      const newTotalQty = updated.reduce((sum, item) => sum + item.quantity, 0);
      if (prevQty < 2 && newTotalQty >= 2) {
        addToast({
          type: 'discount',
          title: '🔥 ¡10% de descuento aplicado!',
          message: 'Ahorras 10% automáticamente por llevar 2 o más productos'
        });
      }

      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totals: CartTotals = calculateCartTotals(items, appliedCoupon);

  const navigateToProduct = (slug: string) => {
    const target = `/producto/${slug}`;
    setCurrentPath(target);
    try {
      window.history.pushState(null, '', target);
    } catch {
      window.location.hash = `#${target}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentPath('/');
    try {
      window.history.pushState(null, '', '/');
    } catch {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCheckout = () => {
    setIsCartOpen(false);
    setCurrentPath('/checkout');
    try {
      window.history.pushState(null, '', '/checkout');
    } catch {
      window.location.hash = '#/checkout';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentProductSlug = currentPath.startsWith('/producto/')
    ? currentPath.replace('/producto/', '')
    : undefined;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        setQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalQuantity: totals.totalQuantity,
        subtotal: totals.subtotal,
        hasDiscount: totals.hasDiscount,
        discountRate: totals.discountRate,
        discountAmount: totals.discountAmount,
        total: totals.total,
        discountReason: totals.discountReason,
        isMultiItemDiscount: totals.isMultiItemDiscount,
        isCouponApplied: totals.isCouponApplied,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponFeedback,
        toasts,
        removeToast,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        navigateToProduct,
        navigateToHome,
        navigateToCheckout,
        currentPath,
        currentProductSlug
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
