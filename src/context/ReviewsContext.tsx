import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Review, ProductStats } from '../types.ts';
import { initialReviews } from '../initialReviews.ts';
import { db } from '../firebase.ts';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

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

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const [connectionStatus, setConnectionStatus] = useState<DatabaseConnectionStatus>('syncing');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Sync with Firebase Firestore
  const syncWithServer = useCallback(async () => {
    try {
      setConnectionStatus('syncing');
      
      const q = query(collection(db, 'reviews'), orderBy('timestamp', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedReviews = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            productId: data.productId,
            author: data.author || '',
            city: data.city,
            rating: data.rating || 5,
            comment: data.comment || '',
            date: data.date || '',
            isDemo: data.isDemo || false,
            verifiedPurchase: data.verifiedPurchase || true,
          } as Review;
        });
        
        // Combine real user reviews from Firestore with initial demo reviews
        setReviews([...fetchedReviews, ...initialReviews]);
        setConnectionStatus('connected');
        setLastSavedAt(new Date());
      }, (error) => {
        console.error('Firestore snapshot error:', error);
        setConnectionStatus('error');
      });
      
      return unsubscribe;
    } catch (err) {
      console.warn('[ReviewsContext] Server sync unavailable:', err);
      setConnectionStatus('offline');
    }
  }, []);

  useEffect(() => {
    let unsub: any;
    const init = async () => {
      unsub = await syncWithServer();
    };
    init();
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [syncWithServer]);

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

    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        author: author.trim(),
        city: city?.trim() || undefined,
        rating: Math.max(1, Math.min(5, Math.round(rating))),
        comment: comment.trim(),
        date: formattedDate,
        timestamp: serverTimestamp(),
        isDemo: false,
        verifiedPurchase: true
      });
      
      setIsSaving(false);
      return { success: true };
    } catch (err: any) {
      console.error('[ReviewsContext] Firestore save error:', err);
      setIsSaving(false);
      return { success: false, error: err.message };
    }
  };

  const resetReviews = async () => {
    // Left unimplemented for public site to prevent malicious users from clearing db
    // Can be used if admin panel is added
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
        syncWithServer: async () => {} // sync is handled real-time now
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
