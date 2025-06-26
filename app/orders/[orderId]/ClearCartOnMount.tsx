// app/orders/[orderId]/ClearCartOnMount.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '@/components/CartProvider';

export default function ClearCartOnMount() {
  const { clearCart, cartCount } = useCart();
  // Use a ref to track if the cart has already been cleared for this session.
  const hasCleared = useRef(false);

  useEffect(() => {
    // Only clear the cart if it has items AND it hasn't been cleared yet.
    if (cartCount > 0 && !hasCleared.current) {
      clearCart();
      // Mark as cleared so it doesn't run again on re-renders.
      hasCleared.current = true;
    }
    // The empty dependency array [] ensures this effect only tries to run on mount.
  }, [cartCount, clearCart]); 

  // This component renders nothing.
  return null;
}