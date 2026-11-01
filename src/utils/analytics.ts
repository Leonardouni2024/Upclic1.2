import { Product, CartItem, Currency } from '../types';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

const TRACKED_PURCHASES_KEY = 'upclic_tracked_purchases_v1';

let configuredGa4Id = (import.meta as any).env?.VITE_GA4_MEASUREMENT_ID || '';
let configuredMetaPixelId = (import.meta as any).env?.VITE_META_PIXEL_ID || '';
let scriptsInitialized = false;

export function configureAnalyticsIds(ga4Id?: string, metaPixelId?: string) {
  if (ga4Id && ga4Id.trim() && !ga4Id.includes('XXXX')) {
    configuredGa4Id = ga4Id.trim();
  }
  if (metaPixelId && metaPixelId.trim() && !metaPixelId.includes('XXXX')) {
    configuredMetaPixelId = metaPixelId.trim();
  }
  initAnalyticsScripts();
}

export function initAnalyticsScripts() {
  if (typeof window === 'undefined' || scriptsInitialized) return;

  // Initialize Google Analytics 4 only if a real Measurement ID is provided
  if (configuredGa4Id && /^G-[A-Z0-9]+$/i.test(configuredGa4Id)) {
    scriptsInitialized = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(configuredGa4Id)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', configuredGa4Id, { send_page_view: true });
  }

  // Initialize Meta Pixel only if a real numerical Pixel ID is provided
  if (configuredMetaPixelId && /^\d{10,20}$/.test(configuredMetaPixelId)) {
    scriptsInitialized = true;
    if (!window.fbq) {
      const n: any = (window.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!window._fbq) window._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      const t = document.createElement('script');
      t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(t);
    }
    window.fbq?.('init', configuredMetaPixelId);
    window.fbq?.('track', 'PageView');
  }
}

export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined') return;
  if (window.gtag && configuredGa4Id) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }
  if (window.fbq && configuredMetaPixelId) {
    window.fbq('track', 'PageView');
  }
}

export function trackViewItem(product: Product, currency: Currency = 'PEN', unitPrice?: number) {
  if (typeof window === 'undefined') return;
  const value = unitPrice ?? product.price;
  if (window.gtag && configuredGa4Id) {
    window.gtag('event', 'view_item', {
      currency,
      value,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: value,
          quantity: 1,
        },
      ],
    });
  }
  if (window.fbq && configuredMetaPixelId) {
    window.fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category,
      content_type: 'product',
      value,
      currency,
    });
  }
}

export function trackAddToCart(
  product: Product,
  quantity: number = 1,
  variantName?: string,
  unitPrice?: number,
  currency: Currency = 'PEN'
) {
  if (typeof window === 'undefined') return;
  const price = unitPrice ?? product.price;
  const value = Number((price * quantity).toFixed(2));

  if (window.gtag && configuredGa4Id) {
    window.gtag('event', 'add_to_cart', {
      currency,
      value,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_variant: variantName || 'Estándar',
          price,
          quantity,
        },
      ],
    });
  }
  if (window.fbq && configuredMetaPixelId) {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value,
      currency,
    });
  }
}

export function trackBeginCheckout(items: CartItem[], total: number, currency: Currency = 'PEN') {
  if (typeof window === 'undefined') return;
  if (window.gtag && configuredGa4Id) {
    window.gtag('event', 'begin_checkout', {
      currency,
      value: Number(total.toFixed(2)),
      items: items.map((item) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        item_category: item.product.category,
        item_variant: item.variantName || 'Estándar',
        price: item.unitPrice ?? item.product.price,
        quantity: item.quantity,
      })),
    });
  }
  if (window.fbq && configuredMetaPixelId) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: items.map((i) => i.product.id),
      num_items: items.reduce((sum, i) => sum + i.quantity, 0),
      value: Number(total.toFixed(2)),
      currency,
    });
  }
}

export function trackPurchase(
  orderId: string,
  total: number,
  items: { productId?: string; name: string; quantity: number; unitPrice: number }[],
  currency: Currency = 'PEN'
) {
  if (typeof window === 'undefined' || !orderId) return;

  // Deduplicate purchase events by orderId
  try {
    const raw = localStorage.getItem(TRACKED_PURCHASES_KEY);
    const tracked: string[] = raw ? JSON.parse(raw) : [];
    if (tracked.includes(orderId)) {
      return;
    }
    tracked.push(orderId);
    localStorage.setItem(TRACKED_PURCHASES_KEY, JSON.stringify(tracked.slice(-100)));
  } catch {
    // ignore storage errors
  }

  if (window.gtag && configuredGa4Id) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      currency,
      value: Number(total.toFixed(2)),
      items: items.map((item, idx) => ({
        item_id: item.productId || `item_${idx}`,
        item_name: item.name,
        price: item.unitPrice,
        quantity: item.quantity,
      })),
    });
  }
  if (window.fbq && configuredMetaPixelId) {
    window.fbq('track', 'Purchase', {
      content_ids: items.map((i, idx) => i.productId || `item_${idx}`),
      content_type: 'product',
      value: Number(total.toFixed(2)),
      currency,
      order_id: orderId,
    });
  }
}
