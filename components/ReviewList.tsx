// components/ReviewList.tsx
'use client';

import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import NextImage from 'next/image';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  imageUrl?: string;
}

interface ReviewListProps {
  productId: string;
  refetchTrigger: number; // A simple trigger to refetch data
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function ReviewList({ productId, refetchTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(`/api/reviews/${productId}`);
      const data = await res.json();
      setReviews(data);
    };
    if (productId) fetchReviews();
  }, [productId, refetchTrigger]); // Refetch when the trigger changes

  if (reviews.length === 0) {
    return <p className="text-stone-500 mt-4">No reviews yet. Be the first to write one!</p>;
  }

  return (
    <div className="mt-8 space-y-8">
      {reviews.map((review) => (
        <div key={review.id} className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500">
              {review.userName.charAt(0)}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h4 className="text-sm font-bold text-stone-900">{review.userName}</h4>
              <p className="ml-4 text-xs text-stone-500">{formatDate(review.createdAt)}</p>
            </div>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`h-5 w-5 ${review.rating > i ? 'text-amber-400' : 'text-stone-300'}`} />
              ))}
            </div>
            <p className="mt-2 text-base text-stone-700">{review.comment}</p>
            {review.imageUrl && (
              <div className="mt-4">
                <NextImage src={review.imageUrl} alt={`Review image from ${review.userName}`} width={150} height={150} className="rounded-lg object-cover" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}