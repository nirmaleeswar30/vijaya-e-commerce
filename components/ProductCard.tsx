// components/ProductCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { Star, Heart, ShoppingCart } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[] | null;
  description?: string;
  isFeatured?: boolean;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
}

interface ProductCardProps {
  product: Product;
}

const formatPrice = (priceInPaise: number) => {
  // Use 'en-IN' for Indian Rupee format without decimals (₹899)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInPaise / 100);
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : '/placeholder.png';
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const discount = product.originalPrice && product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link href={`/product-details/${product.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
        <div className="relative overflow-hidden h-48">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors">
              <Heart className="h-4 w-4 text-stone-600" />
            </button>
          </div>
          {discount && discount > 0 && (
            <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {discount}% OFF
            </div>
          )}
        </div>
        
        {/* Flex-grow allows this section to expand and push the button to the bottom */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-base font-semibold text-stone-800 mb-2 truncate" title={product.name}>
            {product.name}
          </h3>
          
          {/* --- START OF RATING AND PRICE FIX --- */}
          <div className="flex items-center mb-3 h-5">
            {product.rating && (
              <>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={product.rating! >= i + 1 ? 'text-yellow-400' : 'text-gray-300'}
                      fill="currentColor"
                    />
                  ))}
                </div>
                {product.reviews && <span className="text-xs text-stone-500 ml-2">({product.reviews})</span>}
              </>
            )}
          </div>
          
          <div className="flex items-baseline mb-4">
            <span className="text-2xl font-bold text-stone-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-stone-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {/* --- END OF RATING AND PRICE FIX --- */}
          
          {/* Spacer div to push button to the bottom */}
          <div className="flex-grow" />

          <button
            onClick={handleAddToCart}
            className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors duration-300 flex items-center justify-center"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}