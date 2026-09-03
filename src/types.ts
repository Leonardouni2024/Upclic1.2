export type ProductCategory = 'all' | 'office' | 'windows' | 'combos' | 'project-visio' | 'top' | 'bestsellers' | 'offers';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'office' | 'windows' | 'combos' | 'project-visio';
  price: number;
  oldPrice?: number;
  duration: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  fallbackImage: string;
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
  isoFormat?: string;
  installationSteps: string[];
}

export interface PromoCoupon {
  code: string;
  discountRate: number; // e.g. 0.30 (30%)
  description: string;
  expirationDays: number;
  nonCombinable: boolean;
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
  product: Product;
  quantity: number;
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
