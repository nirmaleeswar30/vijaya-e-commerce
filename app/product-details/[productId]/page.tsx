// app/product-details/[productId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { type Product } from '@/components/ProductCard';
import ReviewList from '@/components/ReviewList';
import ReviewForm from '@/components/ReviewForm';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';



const formatPrice = (priceInPaise: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(priceInPaise / 100);
};

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.productId as string;
    const { addToCart } = useCart();
    const { isSignedIn } = useUser();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        if (!productId) return;
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/product/${productId}`);
                if (!res.ok) throw new Error('Product not found');
                const data: Product = await res.json();
                setProduct(data);
            } catch (error) {
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);
    
    if (isLoading) return <ProductSkeleton />;
    if (!product) return notFound();

    const handleAddToCart = () => { addToCart(product); };

    // --- THIS IS THE FIX ---
    // Safely determine the primary image URL, with a fallback.
    const primaryImage = (product.images && product.images.length > 0)
        ? product.images[0]
        : '/placeholder.png'; // Make sure public/placeholder.png exists
    // --- END OF FIX ---

    return (
        <div className="bg-white">
            {/* Main Product Section */}
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <div>
                        {/* Use the safe primaryImage variable here */}
                        <NextImage src={primaryImage} alt={product.name} width={600} height={600} className="rounded-lg shadow-lg" priority />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-stone-900">{product.name}</h1>
                        <div className="mt-3">
                            <p className="text-3xl tracking-tight text-stone-900">{formatPrice(product.price)}</p>
                        </div>
                        
                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="space-y-6 text-base text-stone-700">
                                {product.description?.split('\n').map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleAddToCart} className="w-full mt-10 bg-amber-500 text-white font-bold py-3 rounded-md hover:bg-amber-600 transition-colors shadow-sm">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-stone-50 border-t">
                <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight text-stone-900">Customer Reviews</h2>
                    <ReviewList productId={productId} refetchTrigger={refetchTrigger} />
                    
                    <div className="mt-10">
                      {isSignedIn ? (
                        <ReviewForm productId={productId} onReviewSubmitted={() => setRefetchTrigger(t => t + 1)} />
                      ) : (
                        <p className="text-stone-600">Please <Link href={`/sign-in?redirect_url=/product-details/${productId}`} className="text-amber-600 hover:underline">sign in</Link> to write a review.</p>
                      )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductSkeleton() {
    return (
        <div className="bg-white py-16 animate-pulse">
            <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-200 rounded-lg w-full aspect-square"></div>
                <div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-2"><div className="h-4 bg-gray-200 rounded w-full"></div><div className="h-4 bg-gray-200 rounded w-full"></div><div className="h-4 bg-gray-200 rounded w-5/6"></div></div>
                    <div className="h-12 bg-gray-300 rounded-md w-full mt-8"></div>
                </div>
            </div>
        </div>
    )
}