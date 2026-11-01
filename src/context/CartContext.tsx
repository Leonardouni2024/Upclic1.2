import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  CartItem,
  ProductCategory,
  CartTotals,
  Currency,
  PromoCoupon,
  PaymentSettings
} from '../types';
import {
  products as initialProducts,
  calculateCartTotals,
  getProductBySlug,
  DynamicCoupon,
  validateCoupon,
  setRuntimeProducts,
  setRuntimeCoupons
} from '../products';
import { translations, getTranslation } from '../utils/i18n';
import {
  trackAddToCart,
  trackBeginCheckout,
  trackViewItem,
  trackPageView,
  configureAnalyticsIds,
  initAnalyticsScripts
} from '../utils/analytics';

export type HelpSection =
  | 'quienes-somos'
  | 'contacto'
  | 'faq'
  | 'privacidad'
  | 'terminos'
  | 'garantia'
  | 'reembolsos'
  | 'envio';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariantId?: string) => void;
  buyNow: (product: Product, quantity?: number, selectedVariantId?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotals: CartTotals;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeHelpSection: HelpSection | null;
  setActiveHelpSection: (sec: HelpSection | null) => void;
  currentView: 'home' | 'product' | 'checkout' | 'admin';
  setCurrentView: (view: 'home' | 'product' | 'checkout' | 'admin') => void;
  goToHome: () => void;
  goToCheckout: () => void;
  goToAdmin: () => void;
  couponCode: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  promoCoupon: PromoCoupon | null;
  setPromoCoupon: (coupon: PromoCoupon | null) => void;
  activeDynamicCoupon: DynamicCoupon | null;
  setActiveDynamicCoupon: (coupon: DynamicCoupon | null) => void;
  isEntryPopupOpen: boolean;
  setIsEntryPopupOpen: (open: boolean) => void;
  isUserOrdersOpen: boolean;
  setIsUserOrdersOpen: (open: boolean) => void;
  isDiscountUnlocked: boolean;
  unlockDiscount: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: number;
  rates: { PEN: number; COP: number; MXN: number; USD: number };
  ratesSource: string;
  ratesLastUpdated: string;
  refreshExchangeRates: () => Promise<void>;
  countryCode: string;
  language: 'ES' | 'EN';
  setLanguage: (lang: 'ES' | 'EN') => void;
  selectCountry: (country: string, manual?: boolean) => void;
  t: ((key: keyof typeof translations.ES) => any) & typeof translations.ES;
  formatPrice: (priceInPEN: number) => string;
  productStocks: Record<string, number>;
  decrementStock: (items: { id: string; quantity: number }[]) => void;
  getStock: (productId: string) => number;
  catalogProducts: Product[];
  paymentSettings: PaymentSettings | null;
  refreshCatalog: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'upclic_cart_v1';
const COUPON_STORAGE_KEY = 'upclic_coupon_v1';
const PROMO_COUPON_STORAGE_KEY = 'upclic_promo_coupon_v1';
const DYNAMIC_COUPON_STORAGE_KEY = 'upclic_dynamic_coupon_v1';
const DISCOUNT_UNLOCKED_KEY = 'upclic_discount_unlocked_v1';

const VALID_CATEGORIES: ProductCategory[] = [
  'all',
  'streaming',
  'office',
  'windows',
  'ia',
  'diseno',
  'profesional',
  'combos',
  'project-visio',
  'apps',
  'offers',
  'bestsellers',
  'top'
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(initialProducts);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      return parsed
        .map(item => {
          const freshProduct = initialProducts.find(p => p.id === item.product.id);
          if (!freshProduct) return null;
          let unitPrice = freshProduct.price;
          let variantName = item.variantName;
          if (item.selectedVariant && freshProduct.variants) {
            const v = freshProduct.variants.find(va => va.id === item.selectedVariant);
            if (v) {
              unitPrice = v.price;
              variantName = v.name;
            }
          }
          return {
            ...item,
            product: freshProduct,
            unitPrice,
            variantName
          };
        })
        .filter(Boolean) as CartItem[];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [promoCoupon, setPromoCouponState] = useState<PromoCoupon | null>(() => {
    try {
      const saved = localStorage.getItem(PROMO_COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeDynamicCoupon, setActiveDynamicCouponState] = useState<DynamicCoupon | null>(() => {
    try {
      const saved = localStorage.getItem(DYNAMIC_COUPON_STORAGE_KEY);
      if (!saved) return null;
      const parsed: DynamicCoupon = JSON.parse(saved);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(DYNAMIC_COUPON_STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [isEntryPopupOpen, setIsEntryPopupOpen] = useState(false);
  const [isUserOrdersOpen, setIsUserOrdersOpen] = useState(false);

  const [isDiscountUnlocked, setIsDiscountUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DISCOUNT_UNLOCKED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Primary market: Peru (S/ PEN) and Spanish (ES) by default
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const manualLock = localStorage.getItem('upclic_manual_country') === 'true';
      if (manualLock) {
        const saved = localStorage.getItem('upclic_currency') as Currency;
        if (['PEN', 'USD', 'COP', 'MXN'].includes(saved)) return saved;
      }
    } catch {}
    return 'PEN';
  });

  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('upclic_exchange_rate');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {}
    return 3.75;
  });

  const [rates, setRates] = useState<{ PEN: number; COP: number; MXN: number; USD: number }>(() => {
    try {
      const saved = localStorage.getItem('upclic_rates');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          PEN: Number(parsed.PEN) || 3.75,
          COP: Number(parsed.COP) || 4100,
          MXN: Number(parsed.MXN) || 19.8,
          USD: 1.0
        };
      }
    } catch {}
    return { PEN: 3.75, COP: 4100, MXN: 19.8, USD: 1.0 };
  });

  const [ratesSource, setRatesSource] = useState<string>('Google Finance');
  const [ratesLastUpdated, setRatesLastUpdated] = useState<string>(new Date().toISOString());

  const [countryCode, setCountryCode] = useState<string>(() => {
    try {
      const manualLock = localStorage.getItem('upclic_manual_country') === 'true';
      if (manualLock) {
        return localStorage.getItem('upclic_country') || 'PE';
      }
    } catch {}
    return 'PE';
  });

  const [language, setLanguageState] = useState<'ES' | 'EN'>(() => {
    try {
      const manualLock = localStorage.getItem('upclic_manual_country') === 'true';
      if (manualLock) {
        const saved = localStorage.getItem('upclic_language');
        if (saved === 'EN' || saved === 'ES') return saved;
      }
    } catch {}
    return 'ES';
  });

  const [productStocks, setProductStocks] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('upclic_product_stocks_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<string, number> = {};
    initialProducts.forEach(p => {
      initial[p.id] = p.stock ?? 30;
    });
    return initial;
  });

  const refreshCatalog = useCallback(async () => {
    try {
      const res = await fetch('/api/catalog');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        setRuntimeProducts(data.products);
        // Re-read enriched products from module
        const { products: updatedProducts } = await import('../products');
        setCatalogProducts([...updatedProducts]);
      }
      if (Array.isArray(data.coupons) && data.coupons.length > 0) {
        setRuntimeCoupons(data.coupons);
      }
      if (data.paymentSettings) {
        setPaymentSettings(data.paymentSettings);
        if (data.paymentSettings.analytics) {
          configureAnalyticsIds(
            data.paymentSettings.analytics.ga4MeasurementId,
            data.paymentSettings.analytics.metaPixelId
          );
        }
      }
    } catch {
      // Fallback to local static catalog
    }
  }, []);

  useEffect(() => {
    initAnalyticsScripts();
    refreshCatalog();
  }, [refreshCatalog]);

  const decrementStock = (purchasedItems: { id: string; quantity: number }[]) => {
    setProductStocks(prev => {
      const next = { ...prev };
      purchasedItems.forEach(item => {
        const current = next[item.id] ?? 30;
        next[item.id] = Math.max(0, current - item.quantity);
      });
      try {
        localStorage.setItem('upclic_product_stocks_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const getStock = (productId: string): number => {
    const prod = catalogProducts.find(p => p.id === productId);
    if (prod && typeof prod.stock === 'number') return prod.stock;
    return productStocks[productId] ?? 30;
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('upclic_currency', c);
    } catch {}
  };

  const setLanguage = (lang: 'ES' | 'EN') => {
    setLanguageState(lang);
    try {
      localStorage.setItem('upclic_language', lang);
    } catch {}
  };

  const selectCountry = (code: string, manual: boolean = true) => {
    const clean = code.toUpperCase();
    setCountryCode(clean);
    let targetCurrency: Currency = 'PEN';
    let targetLang: 'ES' | 'EN' = 'ES';

    if (clean === 'PE') {
      targetCurrency = 'PEN';
      targetLang = 'ES';
    } else if (clean === 'CO') {
      targetCurrency = 'COP';
      targetLang = 'ES';
    } else if (clean === 'MX') {
      targetCurrency = 'MXN';
      targetLang = 'ES';
    } else if (clean === 'US') {
      targetCurrency = 'USD';
      targetLang = 'EN';
    } else {
      targetCurrency = 'USD';
      targetLang = 'ES';
    }

    setCurrency(targetCurrency);
    setLanguage(targetLang);

    try {
      localStorage.setItem('upclic_country', clean);
      if (manual) {
        localStorage.setItem('upclic_manual_country', 'true');
      }
    } catch {}
  };

  const refreshExchangeRates = async () => {
    try {
      const res = await fetch('/api/rates');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          const newRates = {
            PEN: Number(data.rates.PEN) || 3.75,
            COP: Number(data.rates.COP) || 4100,
            MXN: Number(data.rates.MXN) || 19.8,
            USD: 1.0
          };
          setRates(newRates);
          setExchangeRate(newRates.PEN);
          if (data.source) setRatesSource(data.source);
          if (data.lastUpdated) setRatesLastUpdated(data.lastUpdated);
          try {
            localStorage.setItem('upclic_rates', JSON.stringify(newRates));
            localStorage.setItem('upclic_exchange_rate', newRates.PEN.toString());
          } catch {}
          return;
        }
      }
    } catch {}
  };

  useEffect(() => {
    // Ensure default currency in storage is PEN unless manually locked
    try {
      if (localStorage.getItem('upclic_manual_country') !== 'true') {
        localStorage.setItem('upclic_currency', 'PEN');
        localStorage.setItem('upclic_country', 'PE');
        localStorage.setItem('upclic_language', 'ES');
      }
    } catch {}
    refreshExchangeRates();
  }, []);

  const formatPrice = (priceInPEN: number): string => {
    const penRate = rates.PEN || exchangeRate || 3.75;
    const priceInUSD = priceInPEN / penRate;

    if (currency === 'USD') {
      return `$ ${priceInUSD.toFixed(2)} USD`;
    }
    if (currency === 'COP') {
      const copRate = rates.COP || 4100;
      const priceInCOP = Math.round(priceInUSD * copRate);
      return `$ ${priceInCOP.toLocaleString('es-CO')} COP`;
    }
    if (currency === 'MXN') {
      const mxnRate = rates.MXN || 19.8;
      const priceInMXN = priceInUSD * mxnRate;
      return `$ ${priceInMXN.toFixed(2)} MXN`;
    }
    return `S/ ${priceInPEN.toFixed(2)}`;
  };

  const t = Object.assign(
    (key: keyof typeof translations.ES): any => getTranslation(language, key),
    translations[language] || translations.ES
  );

  const unlockDiscount = () => {
    setIsDiscountUnlocked(true);
    try {
      localStorage.setItem(DISCOUNT_UNLOCKED_KEY, 'true');
    } catch {}
  };

  const setPromoCoupon = (coupon: PromoCoupon | null) => {
    setPromoCouponState(coupon);
    try {
      if (coupon) {
        localStorage.setItem(PROMO_COUPON_STORAGE_KEY, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(PROMO_COUPON_STORAGE_KEY);
      }
    } catch {}
  };

  const setActiveDynamicCoupon = (coupon: DynamicCoupon | null) => {
    setActiveDynamicCouponState(coupon);
    try {
      if (coupon) {
        localStorage.setItem(DYNAMIC_COUPON_STORAGE_KEY, JSON.stringify(coupon));
        setCouponCode(coupon.code);
        localStorage.setItem(COUPON_STORAGE_KEY, coupon.code);
      } else {
        localStorage.removeItem(DYNAMIC_COUPON_STORAGE_KEY);
      }
    } catch {}
  };

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategoryState] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(null);
  const [activeHelpSection, setActiveHelpSection] = useState<HelpSection | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'checkout' | 'admin'>('home');

  const resolveRoute = useCallback(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path === '/admin' || path.startsWith('/admin/')) {
      setSelectedProductState(null);
      setCurrentView('admin');
      return;
    }

    if (params.get('cart') === 'open') {
      setIsCartOpen(true);
    }

    const statusParam = params.get('status');
    if (path === '/checkout' || statusParam === 'success' || statusParam === 'approved' || statusParam === 'pending') {
      setSelectedProductState(null);
      setCurrentView('checkout');
      return;
    }

    const productMatch = path.match(/^\/producto\/([^/]+)\/?$/);
    if (productMatch) {
      const slug = decodeURIComponent(productMatch[1]);
      const found = getProductBySlug(slug, catalogProducts);
      if (found) {
        setSelectedProductState(found);
        setCurrentView('product');
        return;
      }
    }

    const catMatch = path.match(/^\/categoria\/([^/]+)\/?$/);
    if (catMatch) {
      const cat = decodeURIComponent(catMatch[1]) as ProductCategory;
      if (VALID_CATEGORIES.includes(cat)) {
        setSelectedCategoryState(cat);
        setSelectedProductState(null);
        setCurrentView('home');
        return;
      }
    }

    const querySlug = params.get('producto');
    if (querySlug) {
      const found = getProductBySlug(querySlug, catalogProducts);
      if (found) {
        setSelectedProductState(found);
        setCurrentView('product');
        window.history.replaceState({}, '', `/producto/${found.slug}`);
        return;
      }
    }

    const queryCat = params.get('categoria') as ProductCategory | null;
    if (queryCat && VALID_CATEGORIES.includes(queryCat)) {
      setSelectedCategoryState(queryCat);
      setSelectedProductState(null);
      setCurrentView('home');
      window.history.replaceState({}, '', queryCat === 'all' ? '/' : `/categoria/${queryCat}`);
      return;
    }

    setSelectedProductState(null);
    setCurrentView('home');
  }, [catalogProducts]);

  useEffect(() => {
    resolveRoute();
    const handlePopState = () => resolveRoute();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [resolveRoute]);

  const setSelectedProduct = (product: Product | null) => {
    setSelectedProductState(product);
    if (product) {
      setCurrentView('product');
      const newUrl = `/producto/${product.slug}`;
      if (window.location.pathname !== newUrl) {
        window.history.pushState({ productSlug: product.slug }, '', newUrl);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      trackViewItem(product, currency);
      trackPageView(newUrl, `${product.name} | UPCLIC`);
    } else {
      setCurrentView('home');
      const newUrl = selectedCategory === 'all' ? '/' : `/categoria/${selectedCategory}`;
      if (window.location.pathname !== newUrl) {
        window.history.pushState({}, '', newUrl);
      }
    }
  };

  const setSelectedCategory = (cat: ProductCategory) => {
    setSelectedCategoryState(cat);
    setSelectedProductState(null);
    setCurrentView('home');
    const newUrl = cat === 'all' ? '/' : `/categoria/${cat}`;
    if (window.location.pathname !== newUrl) {
      window.history.pushState({ category: cat }, '', newUrl);
    }
    trackPageView(newUrl, `UPCLIC - ${cat}`);
  };

  const goToHome = () => {
    setSelectedProductState(null);
    setCurrentView('home');
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCheckout = () => {
    setIsCartOpen(false);
    setSelectedProductState(null);
    setCurrentView('checkout');
    if (window.location.pathname !== '/checkout') {
      window.history.pushState({}, '', '/checkout');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const totals = calculateCartTotals(items, couponCode, activeDynamicCoupon || undefined, isDiscountUnlocked);
    trackBeginCheckout(items, totals.total, currency);
  };

  const goToAdmin = () => {
    setIsCartOpen(false);
    setSelectedProductState(null);
    setCurrentView('admin');
    if (window.location.pathname !== '/admin') {
      window.history.pushState({}, '', '/admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedProduct) {
      document.title = `${selectedProduct.name} | UPCLIC`;
    } else if (currentView === 'checkout') {
      document.title = `Finalizar Compra Segura | UPCLIC`;
    } else if (currentView === 'admin') {
      document.title = `Panel de Administración | UPCLIC`;
    } else {
      document.title = `UPCLIC | Todo lo digital, en un solo lugar`;
    }
  }, [selectedProduct, currentView]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const buildCartItemDetails = (product: Product, selectedVariantId?: string) => {
    let unitPrice = product.price;
    let variantName: string | undefined = undefined;
    let finalVariantId = selectedVariantId;

    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
      finalVariantId = variant.id;
      variantName = variant.name;
      unitPrice = variant.price;
    }

    const itemId = finalVariantId ? `${product.id}__${finalVariantId}` : product.id;
    return { itemId, unitPrice, variantName, finalVariantId };
  };

  const addToCart = (product: Product, quantity = 1, selectedVariantId?: string) => {
    const availableStock = getStock(product.id);
    if (availableStock <= 0) return;

    const { itemId, unitPrice, variantName, finalVariantId } = buildCartItemDetails(product, selectedVariantId);
    setItems(prev => {
      const existing = prev.find(i => (i.id || i.product.id) === itemId);
      if (existing) {
        const nextQty = Math.min(availableStock, existing.quantity + quantity);
        return prev.map(i => ((i.id || i.product.id) === itemId ? { ...i, quantity: nextQty } : i));
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          quantity: Math.min(availableStock, quantity),
          selectedVariant: finalVariantId,
          variantName,
          unitPrice
        }
      ];
    });
    trackAddToCart(product, quantity, variantName, unitPrice, currency);
    setIsCartOpen(true);
  };

  const buyNow = (product: Product, quantity = 1, selectedVariantId?: string) => {
    const availableStock = getStock(product.id);
    if (availableStock <= 0) return;

    const { itemId, unitPrice, variantName, finalVariantId } = buildCartItemDetails(product, selectedVariantId);
    setItems(prev => {
      const existing = prev.find(i => (i.id || i.product.id) === itemId);
      if (existing) {
        const nextQty = Math.min(availableStock, existing.quantity + quantity);
        return prev.map(i => ((i.id || i.product.id) === itemId ? { ...i, quantity: nextQty } : i));
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          quantity: Math.min(availableStock, quantity),
          selectedVariant: finalVariantId,
          variantName,
          unitPrice
        }
      ];
    });
    trackAddToCart(product, quantity, variantName, unitPrice, currency);
    setIsCartOpen(false);
    setSelectedProductState(null);
    setCurrentView('checkout');
    if (window.location.pathname !== '/checkout') {
      window.history.pushState({}, '', '/checkout');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(i => (i.id || i.product.id) !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev =>
      prev.map(i => {
        if ((i.id || i.product.id) === itemId) {
          const maxStock = getStock(i.product.id);
          return { ...i, quantity: Math.min(maxStock, quantity) };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    try {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      return { success: false, message: 'Ingresa un código de cupón válido.' };
    }
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

    const validation = validateCoupon(clean, Math.max(1, totalQuantity));
    if (validation.valid) {
      setCouponCode(clean);
      try {
        localStorage.setItem(COUPON_STORAGE_KEY, clean);
      } catch {}
      return {
        success: true,
        message: `¡Cupón ${clean} aplicado! (${validation.message})`
      };
    }

    if (activeDynamicCoupon && activeDynamicCoupon.code === clean) {
      if (activeDynamicCoupon.expiresAt && Date.now() > activeDynamicCoupon.expiresAt) {
        setActiveDynamicCoupon(null);
        return { success: false, message: 'Este cupón especial ha expirado.' };
      }
      setCouponCode(clean);
      try {
        localStorage.setItem(COUPON_STORAGE_KEY, clean);
      } catch {}
      return {
        success: true,
        message: `¡Cupón exclusivo ${clean} (${activeDynamicCoupon.discountPercent}% OFF) aplicado!`
      };
    }

    if (promoCoupon && promoCoupon.code === clean) {
      setCouponCode(clean);
      try {
        localStorage.setItem(COUPON_STORAGE_KEY, clean);
      } catch {}
      return {
        success: true,
        message: `¡Cupón ${clean} (${Math.round(promoCoupon.discountRate * 100)}% OFF) aplicado correctamente!`
      };
    }
    return {
      success: false,
      message: validation.message || 'El código ingresado no es válido o ha expirado.'
    };
  };

  const removeCoupon = () => {
    setCouponCode('');
    try {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  };

  const cartTotals = calculateCartTotals(
    items,
    couponCode,
    activeDynamicCoupon || undefined,
    isDiscountUnlocked
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotals,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        activeHelpSection,
        setActiveHelpSection,
        currentView,
        setCurrentView,
        goToHome,
        goToCheckout,
        goToAdmin,
        couponCode,
        applyCoupon,
        removeCoupon,
        promoCoupon,
        setPromoCoupon,
        activeDynamicCoupon,
        setActiveDynamicCoupon,
        isEntryPopupOpen,
        setIsEntryPopupOpen,
        isUserOrdersOpen,
        setIsUserOrdersOpen,
        isDiscountUnlocked,
        unlockDiscount,
        currency,
        setCurrency,
        exchangeRate,
        rates,
        ratesSource,
        ratesLastUpdated,
        refreshExchangeRates,
        countryCode,
        language,
        setLanguage,
        selectCountry,
        t,
        formatPrice,
        productStocks,
        decrementStock,
        getStock,
        catalogProducts,
        paymentSettings,
        refreshCatalog
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
