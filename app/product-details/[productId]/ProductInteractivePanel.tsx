// app/product-details/[productId]/ProductInteractivePanel.tsx
'use client';

import { useState, useEffect, Fragment } from 'react';
import { type Product } from './page';
import QuantitySelector from '@/components/QuantitySelector';
import { useCart } from '@/components/CartProvider';
import { useUser } from '@clerk/nextjs';
import { Tab, RadioGroup } from '@headlessui/react';
import { StarIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

// Helper function for conditional class names
function classNames(...classes: (string | boolean)[]) { return classes.filter(Boolean).join(' ') }

// Helper function to format price
const formatPrice = (priceInPaise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(priceInPaise / 100);

// --- TYPE DEFINITIONS ---
interface Review {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    imageUrl?: string | null; // imageUrl is optional
}

// --- SUB-COMPONENTS for Reviews ---

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={classNames(i < rating ? 'text-amber-400' : 'text-stone-300', 'h-5 w-5 flex-shrink-0')} aria-hidden="true" />
            ))}
        </div>
    );
}

function ReviewForm({ productId, onReviewSubmit }: { productId: string, onReviewSubmit: (newReview: Review) => void }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB size limit
                setError('File size cannot exceed 5MB.');
                return;
            }
            setError('');
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    
    const removeImage = () => {
        setImage(null);
        if (preview) {
            URL.revokeObjectURL(preview); // Clean up memory
            setPreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '') {
            setError('Please provide a rating and a comment.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append('rating', String(rating));
        formData.append('comment', comment);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await fetch(`/api/reviews/${productId}`, {
                method: 'POST',
                body: formData, // Browser will set the correct 'multipart/form-data' header
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to submit review');
            }
            const newReview = await response.json();
            onReviewSubmit(newReview); // Optimistically update the UI
            // Reset form
            setRating(0); 
            setComment(''); 
            removeImage();
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 border-t border-stone-200 pt-6">
            <h3 className="text-lg font-medium text-stone-900">Write a review</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                <div>
                    <p className="text-sm font-medium text-stone-600">Your rating *</p>
                    <div className="flex items-center space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none p-1">
                                <StarIcon className={classNames(star <= rating ? 'text-amber-400' : 'text-stone-300', 'h-7 w-7 transition-colors hover:text-amber-400')} />
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-stone-600 mb-2">Your comment *</label>
                    <textarea id="comment" name="comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} required className="w-full rounded-md border-stone-300 shadow-sm focus:ring-amber-500 focus:border-amber-500" placeholder="Share your thoughts about the product..."></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-600">Add a photo (optional)</label>
                    <div className="mt-2 flex items-center gap-x-3">
                        <input type="file" id="image-upload" accept="image/png, image/jpeg" onChange={handleFileChange} className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                    </div>
                    {preview && (
                        <div className="mt-4 relative w-32 h-32">
                            <Image src={preview} alt="Image preview" fill className="rounded-md object-cover" />
                            <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-white rounded-full text-stone-500 hover:text-red-500 transition-colors">
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>
                    )}
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={isSubmitting} className="rounded-md bg-amber-500 py-2.5 px-5 text-sm font-medium text-white shadow-sm hover:bg-amber-600 disabled:opacity-50 transition-colors">
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}


// --- MAIN COMPONENT ---
export default function ProductInteractivePanel({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedWeight, setSelectedWeight] = useState(product.variants?.weight?.[0] || '');
    const [selectedSize, setSelectedSize] = useState(product.variants?.size?.[0] || '');
    const [reviews, setReviews] = useState<Review[]>([]);
    
    const { addToCart } = useCart();
    const { isSignedIn } = useUser();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/reviews/${product.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            }
        };
        fetchReviews();
    }, [product.id]);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: `${product.name} (${selectedWeight || ''}${selectedWeight && selectedSize ? ', ' : ''}${selectedSize || ''})`,
            price: product.price,
            image: product.images[0],
            quantity: quantity
        });
    };

    return (
        <div>
            {/* Product Info */}
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">{product.name}</h1>
            <p className="text-3xl mt-3 text-stone-800">{formatPrice(product.price)}</p>

            {/* Variant Selectors */}
            <div className="mt-8 space-y-6">
                {product.variants?.weight && (
                    <RadioGroup value={selectedWeight} onChange={setSelectedWeight}>
                        <RadioGroup.Label className="block text-sm font-medium text-stone-700">WEIGHT</RadioGroup.Label>
                        <div className="mt-2 flex flex-wrap gap-3">
                            {product.variants.weight.map((w) => (
                                <RadioGroup.Option key={w} value={w} className={({ checked }) => `${checked ? 'bg-amber-500 text-white ring-2 ring-amber-500' : 'bg-white text-stone-900 ring-1 ring-inset ring-stone-300'} cursor-pointer rounded-md py-2 px-4 text-sm font-medium transition-colors hover:bg-stone-50 focus:outline-none`}>
                                    <span>{w}</span>
                                </RadioGroup.Option>
                            ))}
                        </div>
                    </RadioGroup>
                )}
                {product.variants?.size && (
                     <RadioGroup value={selectedSize} onChange={setSelectedSize}>
                        <RadioGroup.Label className="block text-sm font-medium text-stone-700">SIZE</RadioGroup.Label>
                        <div className="mt-2 flex flex-wrap gap-3">
                            {product.variants.size.map((s) => (
                                <RadioGroup.Option key={s} value={s} className={({ checked }) => `${checked ? 'bg-amber-500 text-white ring-2 ring-amber-500' : 'bg-white text-stone-900 ring-1 ring-inset ring-stone-300'} cursor-pointer rounded-md py-2 px-4 text-sm font-medium transition-colors hover:bg-stone-50 focus:outline-none`}>
                                    <span>{s}</span>
                                </RadioGroup.Option>
                            ))}
                        </div>
                    </RadioGroup>
                )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center gap-x-4">
                <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                <button onClick={handleAddToCart} className="flex-1 rounded-md bg-amber-500 py-3 px-8 text-base font-medium text-white shadow-sm hover:bg-amber-600 transition-colors">Add to Cart</button>
            </div>
            
            {/* Tabbed Section */}
            <div className="w-full mt-16">
                <Tab.Group>
                    <Tab.List className="flex space-x-1 border-b border-stone-200">
                        <Tab className={({ selected }) => classNames( 'w-full py-2.5 text-sm font-medium leading-5', 'focus:outline-none', selected ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-stone-800' )}>Description</Tab>
                        <Tab className={({ selected }) => classNames( 'w-full py-2.5 text-sm font-medium leading-5', 'focus:outline-none', selected ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500 hover:text-stone-800' )}>Reviews ({reviews.length})</Tab>
                    </Tab.List>
                    <Tab.Panels className="mt-6">
                        <Tab.Panel className="text-stone-600 prose max-w-none prose-h3:font-semibold prose-h3:text-stone-800 prose-p:my-4">
                            <div dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }} />
                        </Tab.Panel>
                        <Tab.Panel>
                            {reviews.length > 0 ? (
                                <div className="space-y-8">
                                    {reviews.map(review => (
                                        <div key={review.id} className="border-b border-stone-200 pb-6 last:border-b-0">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <StarRating rating={review.rating} />
                                                    <p className="mt-1 font-bold text-stone-800">{review.userName}</p>
                                                </div>
                                                <p className="ml-auto text-sm text-stone-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <p className="mt-4 text-stone-600">{review.comment}</p>
                                            {review.imageUrl && (
                                                <div className="mt-4 relative w-40 h-40 rounded-lg overflow-hidden border">
                                                    <Image src={review.imageUrl} alt={`Review image by ${review.userName}`} fill className="object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-stone-600">No reviews yet. Be the first to share your thoughts!</p>
                            )}
                            {isSignedIn && <ReviewForm productId={product.id} onReviewSubmit={(newReview) => setReviews([newReview, ...reviews])} />}
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
}