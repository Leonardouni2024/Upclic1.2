import React, { createContext, useContext, useState, useEffect } from 'react';
import { Review, ProductStats } from '../types.ts';
import { initialReviews } from '../initialReviews.ts';

interface ReviewsContextType {
  reviews: Review[];
  getProductReviews: (productId: string) => Review[];
  getProductStats: (productId: string) => ProductStats;
  addReview: (reviewInput: {
    productId: string;
    author: string;
    city?: string;
    rating: number;
    comment: string;
  }) => void;
  resetToDemoReviews: () => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const LOCAL_STORAGE_REVIEWS_KEY = 'upclic_reviews_v1';

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

  const addReview = ({
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
  }) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    const newReview: Review = {
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

    setReviews(prev => [newReview, ...prev]);
  };

  const resetToDemoReviews = () => {
    setReviews(initialReviews);
    try {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(initialReviews));
    } catch (e) {
      console.error('Error resetting reviews:', e);
    }
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        getProductReviews,
        getProductStats,
        addReview,
        resetToDemoReviews
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
