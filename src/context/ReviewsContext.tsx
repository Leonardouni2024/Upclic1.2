import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Review, ProductStats } from '../types.ts';
import { initialReviews } from '../initialReviews.ts';

export type DatabaseConnectionStatus = 'connected' | 'syncing' | 'offline' | 'error';

interface ReviewsContextType {
  reviews: Review[];
  connectionStatus: DatabaseConnectionStatus;
  isSaving: boolean;
  lastSavedAt: Date | null;
  getProductReviews: (productId: string) => Review[];
  getProductStats: (productId: string) => ProductStats;
  addReview: (reviewInput: {
    productId: string;
    author: string;
    city?: string;
    rating: number;
    comment: string;
  }) => Promise<{ success: boolean; error?: string }>;
  resetReviews: () => Promise<void>;
  resetToDemoReviews?: () => Promise<void>;
  syncWithServer: () => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const LOCAL_STORAGE_REVIEWS_KEY = 'upclic_reviews_v2';

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading reviews from localStorage:', e);
    }
    return initialReviews;
  });

  const [connectionStatus, setConnectionStatus] = useState<DatabaseConnectionStatus>('syncing');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Sync with backend server
  const syncWithServer = useCallback(async () => {
    try {
      setConnectionStatus('syncing');
      const response = await fetch('/api/reviews', { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
        setReviews(data.reviews);
        try {
          localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(data.reviews));
        } catch (e) {
          console.warn('Could not write to localStorage:', e);
        }
        setConnectionStatus('connected');
        setLastSavedAt(new Date());
      } else {
        setConnectionStatus('connected');
      }
    } catch (err) {
      console.warn('[ReviewsContext] Server sync unavailable, using local cache:', err);
      setConnectionStatus('offline');
    }
  }, []);

  // On mount, fetch latest from server
  useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  // Persist reviews to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving reviews to localStorage:', e);
    }
  }, [reviews]);

  const getProductReviews = (productId: string): Review[] => {
    return reviews.filter(r => r.productId === productId);
  };

  const getProductStats = (productId: string): ProductStats => {
    const productReviews = reviews.filter(r => r.productId === productId);
    const totalReviews = productReviews.length;

    if (totalReviews === 0) {
      return {
        averageRating: 5.0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = Number((sum / totalReviews).toFixed(1));

    const distribution = {
      5: productReviews.filter(r => r.rating === 5).length,
      4: productReviews.filter(r => r.rating === 4).length,
      3: productReviews.filter(r => r.rating === 3).length,
      2: productReviews.filter(r => r.rating === 2).length,
      1: productReviews.filter(r => r.rating === 1).length,
    };

    return {
      averageRating,
      totalReviews,
      distribution
    };
  };

  const addReview = async ({
    productId,
    author,
    city,
    rating,
    comment
  }: {
    productId: string;
    author: string;
    city?: string;
    rating: number;
    comment: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsSaving(true);
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    const tempReview: Review = {
      id: `rev-user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId,
      author: author.trim(),
      city: city?.trim() || undefined,
      rating: Math.max(1, Math.min(5, Math.round(rating))),
      comment: comment.trim(),
      date: formattedDate,
      isDemo: false,
      verifiedPurchase: true
    };

    // Optimistic client update
    setReviews(prev => [tempReview, ...prev]);

    // Send to server backend to save persistently in data/reviews.json
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          author: author.trim(),
          city: city?.trim() || undefined,
          rating: Math.round(rating),
          comment: comment.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.review) {
        // Replace temp review with canonical review from server
        setReviews(prev => [resData.review, ...prev.filter(r => r.id !== tempReview.id)]);
        setConnectionStatus('connected');
        setLastSavedAt(new Date());
      }
      setIsSaving(false);
      return { success: true };
    } catch (err: any) {
      console.warn('[ReviewsContext] Saved locally. Server push pending:', err);
      setConnectionStatus('offline');
      setIsSaving(false);
      // Still consider success because it's saved locally
      return { success: true };
    }
  };

  const resetReviews = async () => {
    setReviews(initialReviews);
    try {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(initialReviews));
      await fetch('/api/reviews/reset', { method: 'POST' });
      setConnectionStatus('connected');
    } catch (e) {
      console.error('Error resetting reviews:', e);
    }
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        connectionStatus,
        isSaving,
        lastSavedAt,
        getProductReviews,
        getProductStats,
        addReview,
        resetReviews,
        resetToDemoReviews: resetReviews,
        syncWithServer
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
