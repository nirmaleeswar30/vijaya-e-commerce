// components/ReviewForm.tsx
'use client';

import { useState, useRef } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void; // A function to refetch reviews
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Please provide a rating and a comment.');
      return;
    }
    setIsSubmitting(true);
    let imageUrl = null;

    // 1. If there's an image, upload it to Cloudinary
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'vijaya_dates'); // Create this upload preset in your Cloudinary account

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        imageUrl = data.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Image upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Submit the review to our own API
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment, imageUrl }),
      });
      if (!res.ok) throw new Error('Failed to submit review');

      // Reset form and trigger refetch
      setRating(0);
      setComment('');
      setImage(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      onReviewSubmitted();
      toast.success("Thank you for your review!");
    } catch (error) {
      console.error("Review submission failed:", error);
      alert("Failed to submit your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h3 className="text-lg font-medium text-stone-900">Write a review</h3>
      <div className="mt-4">
        <label className="text-sm font-medium text-stone-700">Rating</label>
        <div className="flex items-center mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`h-6 w-6 cursor-pointer ${
                (hoverRating || rating) >= star ? 'text-amber-400' : 'text-stone-300'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="comment" className="block text-sm font-medium text-stone-700">Comment</label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-stone-700">Add a photo</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex justify-center rounded-md border border-transparent bg-amber-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-600 disabled:bg-stone-300"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

// You need to add this to a toast import file or at the top of this one
import toast from 'react-hot-toast';