// components/CartProvider.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

// --- MODIFICATION 1: Update the addToCart type signature ---
interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    addToCart: (product: { id: string; name: string; price: number; image: string; quantity?: number }) => void;
    decreaseQuantity: (productId: string) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartChange = 
  | { type: 'added' | 'updated' | 'decreased' | 'removed'; item: { id: string; name: string, quantity: number } }
  | { type: 'cleared' }
  | null;

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [lastCartChange, setLastCartChange] = useState<CartChange>(null);

    // --- MODIFICATION 2: Update the addToCart function logic ---
    const addToCart = (product: { id: string; name: string; price: number; image: string; quantity?: number }) => {
        // Default to adding 1 item, but use provided quantity if it exists
        const addQuantity = product.quantity || 1;
        
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            setCartItems(prev => prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + addQuantity } : item));
            setLastCartChange({ item: { ...product, quantity: addQuantity }, type: 'updated' });
        } else {
            setCartItems(prev => [...prev, { ...product, quantity: addQuantity }]);
            setLastCartChange({ item: { ...product, quantity: addQuantity }, type: 'added' });
        }
    };

    const decreaseQuantity = (productId: string) => {
        const itemToDecrease = cartItems.find(item => item.id === productId);
        if (!itemToDecrease) return;

        if (itemToDecrease.quantity === 1) {
            removeFromCart(productId);
        } else {
            setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item));
            // No toast for decreasing to avoid being too noisy
        }
    };

    const removeFromCart = (productId: string) => {
        const itemToRemove = cartItems.find(item => item.id === productId);
        if (!itemToRemove) return;
        setCartItems(prev => prev.filter(item => item.id !== productId));
        setLastCartChange({ item: { ...itemToRemove, quantity: 0 }, type: 'removed' });
    };

    const clearCart = () => {
        setCartItems([]);
        setLastCartChange({ type: 'cleared' });
    };

    // This useEffect handles all toast notifications
    useEffect(() => {
        if (!lastCartChange) return;

        if (lastCartChange.type === 'cleared') {
            toast.success("Your cart has been cleared.", { id: 'cart-cleared' });
        } else {
            const { item, type } = lastCartChange;
            const toastId = `toast-${item.id}`;
            if (type === 'added') {
                toast.success(`${item.name} (${item.quantity > 1 ? `x${item.quantity}`:''}) added to cart!`, { id: toastId });
            } else if (type === 'updated') {
                toast.success(`${item.name} quantity updated!`, { id: toastId });
            } else if (type === 'removed') {
                toast.error(`${item.name} removed from cart!`, { id: toastId });
            }
        }
        
        setLastCartChange(null);
    }, [lastCartChange]);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const value = { cartItems, cartCount, addToCart, decreaseQuantity, removeFromCart, clearCart };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) throw new Error('useCart must be used within a CartProvider');
    return context;
}