// components/CartProvider.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { type Product } from './ProductCard';

export interface CartItem extends Product {
    quantity: number;
    // The 'image' property is now guaranteed to be a string
    image: string; 
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    addToCart: (product: Product) => void;
    decreaseQuantity: (productId: string) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('vijaya_cart');
            if (storedCart) setCartItems(JSON.parse(storedCart));
        } catch (error) {
            localStorage.removeItem('vijaya_cart');
        }
    }, []);

    const saveCart = useCallback((cart: CartItem[]) => {
        setCartItems(cart);
        localStorage.setItem('vijaya_cart', JSON.stringify(cart));
    }, []);

    const addToCart = (product: Product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        let newCart: CartItem[];

        if (existingItem) {
            newCart = cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            toast.success(`${product.name} quantity updated!`, { id: product.id });
        } else {
            // --- THIS IS THE FIX ---
            // Safely get the image URL before creating the new cart item.
            const image = (product.images && product.images.length > 0)
                ? product.images[0]
                : '/placeholder.png'; // Fallback
            
            const newItem: CartItem = {
                ...product,
                image, // Use the safe image variable
                quantity: 1
            };
            newCart = [...cartItems, newItem];
            toast.success(`${product.name} added to cart!`, { id: product.id });
        }
        saveCart(newCart);
    };
    
    const decreaseQuantity = (productId: string) => {
        const existingItem = cartItems.find(item => item.id === productId);
        if (!existingItem) return;

        let newCart: CartItem[];
        if (existingItem.quantity === 1) {
            newCart = cartItems.filter(item => item.id !== productId);
            toast.error(`${existingItem.name} removed from cart!`, { id: productId });
        } else {
            newCart = cartItems.map(item =>
                item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            );
        }
        saveCart(newCart);
    };

    const removeFromCart = (productId: string) => {
        const itemToRemove = cartItems.find(item => item.id === productId);
        if (!itemToRemove) return;
        const newCart = cartItems.filter(item => item.id !== productId);
        saveCart(newCart);
        toast.error(`${itemToRemove.name} removed from cart!`, { id: productId });
    };

    const clearCart = () => {
        saveCart([]);
        // Optional: Toast for clearing cart can be added here if desired
    };

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