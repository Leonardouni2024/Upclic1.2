export type CatalogCategory =
  | 'streaming'
  | 'office'
  | 'windows'
  | 'ia'
  | 'diseno'
  | 'profesional'
  | 'combos'
  | 'project-visio'
  | 'apps';

export type ProductCategory =
  | 'all'
  | CatalogCategory
  | 'offers'
  | 'bestsellers'
  | 'top';

export type Currency = 'PEN' | 'USD' | 'COP' | 'MXN';

export type OrderStatus =
  | 'Pendiente de pago'
  | 'Pago en revisión'
  | 'Pagado'
  | 'En preparación'
  | 'Entregado'
  | 'Cancelado';

export type PaymentMethodId =
  | 'yape'
  | 'plin'
  | 'transferencia'
  | 'mercadopago'
  | 'paypal';

export interface ProductVariant {
  id: string; // e.g. 'oem' | 'retail' | '1-mes' | '3-meses' | '6-meses' | 'perfil' | 'cuenta-completa'
  name: string; // e.g. "Clave tipo OEM (1 PC)" | "Clave tipo Retail (Reinstalable)" | "Perfil Individual"
  type?: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  shortDesc: string;
  months?: number;
  devices?: string;
  licenseType?: 'OEM' | 'Retail' | 'Suscripción' | 'Perfil' | 'Cuenta Completa';
}

export interface ProductDownloadOption {
  id: string;
  name: string;
  url: string;
  badge?: string;
  description?: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CatalogCategory;
  subcategory?: string;
  price: number;
  oldPrice?: number;
  duration: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  fallbackImage: string;
  images?: string[];
  description: string;
  features: string[];
  compatibility: string;
  badge?: string;
  bestSeller?: boolean;
  featured?: boolean;
  cloudStorage?: string;
  warning?: string;
  isAccountAccess?: boolean;
  accountNotice?: string;
  downloadUrl: string;
  downloadLabel?: string;
  downloadOptions?: ProductDownloadOption[];
  isoFormat?: string;
  installationSteps: string[];
  variants?: ProductVariant[];
  stock?: number;
  isImmediateDelivery?: boolean;
  acceptedPaymentGateways?: ('mercadopago' | 'paypal' | 'yape' | 'plin' | 'transferencia')[];
  // Structured fields for full product transparency
  includes?: string[];
  termsOfUse?: string;
  deliveryMode?: string;
  warranty?: string;
  active?: boolean;
}

export interface DeliveredCredentials {
  id?: string;
  serviceName: string;
  productSlug: string;
  email: string;
  password?: string;
  profilePin?: string;
  months?: number;
  loginUrl?: string;
  deliveredAt?: string;
  orderId?: string;
  notes?: string;
}

export interface PromoCoupon {
  code: string;
  discountRate: number; // e.g. 0.10 (10%)
  description: string;
  expirationDays: number;
  nonCombinable: boolean;
  active?: boolean;
}

export interface CartTotals {
  totalQuantity: number;
  subtotal: number;
  hasDiscount: boolean;
  discountRate: number;
  discountAmount: number;
  total: number;
  discountReason?: string;
  isMultiItemDiscount: boolean;
  isCouponApplied: boolean;
}

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
  variantName?: string;
  unitPrice?: number;
}

export interface DemonstrationReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  productName: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  city?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  isDemo?: boolean;
  verifiedPurchase?: boolean;
}

export interface ProductStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface PaymentSettings {
  yape: {
    enabled: boolean;
    phone: string;
    holderName: string;
    qrImageUrl?: string;
    instructions: string;
  };
  plin: {
    enabled: boolean;
    phone: string;
    holderName: string;
    qrImageUrl?: string;
    instructions: string;
  };
  transferencia: {
    enabled: boolean;
    bankName: string;
    accountNumber: string;
    cci: string;
    holderName: string;
    accountType: string;
    instructions: string;
  };
  mercadopago: {
    enabled: boolean;
    label: string;
  };
  paypal: {
    enabled: boolean;
    label: string;
  };
  analytics?: {
    ga4MeasurementId?: string;
    metaPixelId?: string;
  };
}

export interface OrderRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  items: {
    productId?: string;
    slug?: string;
    name: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal?: number;
  discountAmount?: number;
  couponCode?: string;
  total: number;
  currency: Currency;
  gateway: PaymentMethodId | string;
  status: 'pending' | 'review' | 'paid' | 'preparing' | 'delivered' | 'cancelled';
  orderStatus: OrderStatus;
  deliveryStatus: 'Pendiente de envío' | 'En preparación' | 'Entregado' | 'Cancelado';
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
  paymentId?: string;
  operationNumber?: string;
  receiptImage?: string;
  receiptSubmittedAt?: string;
  adminNotes?: string;
  deliveredCredentials?: DeliveredCredentials[];
}
