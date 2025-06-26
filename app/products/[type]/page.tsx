// app/products/[type]/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard, { type Product } from '@/components/ProductCard';

// --- THIS IS THE FIX ---
// The LoadingSpinner function must return a JSX element.
function LoadingSpinner() {
  return (
    <div className="col-span-full flex justify-center items-center py-24">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-500 border-t-transparent"></div>
    </div>
  );
}
// --- END OF FIX ---

// Define the shape of the data we expect from our API
interface ApiResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

function ProductGrid() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const typeParam = params.type;
  const type = Array.isArray(typeParam) ? typeParam[0] : typeParam;

  useEffect(() => {
    if (!type) return;

    setIsLoading(true);
    const fetchProducts = async () => {
      const query = new URLSearchParams(searchParams.toString());

      // If the URL is for a specific type (not 'all'), ensure it's in the query
      if (type !== 'all' && !query.has('type')) {
          query.append('type', type);
      }
      
      try {
        const response = await fetch(`/api/products?${query.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result: ApiResponse = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [type, searchParams]);

  if (isLoading) return <LoadingSpinner />;
  
  if (!data || data.products.length === 0) {
    return (
      <div className="col-span-full text-center p-12 bg-stone-50 rounded-lg">
        <h3 className="text-xl font-semibold text-stone-700">No Products Found</h3>
        <p className="text-stone-500 mt-2">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <>
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {/* We will add pagination controls here */}
    </>
  );
}

export default function TypePage() {
  const params = useParams();
  const typeParam = params.type;
  const type = Array.isArray(typeParam) ? typeParam[0] : typeParam;

  if (!type) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Category not found.</p>
        </div>
    );
  }

  const displayType = type.replace('-', ' ');

  return (
    <div className="bg-white">
      {/* Header Banner */}
      <div className="relative h-60 bg-stone-800">
        <Image 
          fill 
          src="/images/hero-dates.jpg"
          alt={`${displayType} background`} 
          className="object-cover opacity-30" 
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold text-white uppercase tracking-wider capitalize">{displayType}</h1>
          <div className="text-sm mt-4 text-stone-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products/all" className="hover:text-white">Products</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-white capitalize">{displayType}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <FilterSidebar />
          <main className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <Suspense fallback={<LoadingSpinner />}>
                <ProductGrid />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}