// components/AddToCartButton.tsx
'use client';

import { useCart } from "./CartProvider";

interface ProductData {
    id: string;
    name: string;
    price: number;
    image: string;
}

export default function AddToCartButton({ product }: { product: ProductData }) {
    const { addToCart } = useCart(); // Use our custom hook

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
    };
    
    return (
        <button
            onClick={handleAddToCart}
            className="max-w-xs flex-1 bg-amber-400 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-stone-700 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:w-full transition-colors"
        >
            Add to cart
        </button>
    );
}