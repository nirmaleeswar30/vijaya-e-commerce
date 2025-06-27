// app/products/[type]/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
// --- THIS IS THE FIX ---
import { useParams, useSearchParams, useRouter, usePathname } from 'next/navigation';
// --- END OF FIX ---
import Link from 'next/link';
import Image from 'next/image';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard, { type Product } from '@/components/ProductCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

function LoadingSpinner() {
  return (
    <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
        </div>
      ))}
    </div>
  );
}

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

  const type = Array.isArray(params.type) ? params.type[0] : params.type as string;

  useEffect(() => {
    if (!type) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      const query = new URLSearchParams(searchParams.toString());
      query.set('type', type);
      
      try {
        const response = await fetch(`/api/products?${query.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result: ApiResponse = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setData({ products: [], totalPages: 0, currentPage: 1 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [type, searchParams]);

  if (isLoading) return <LoadingSpinner />;
  
  if (!data || !data.products || data.products.length === 0) {
    return (
      <div className="col-span-full text-center p-12 bg-stone-50 rounded-lg">
        <h3 className="text-xl font-semibold text-stone-800">No Products Found</h3>
        <p className="text-stone-500 mt-2">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="col-span-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
        <Pagination currentPage={data.currentPage} totalPages={data.totalPages} />
    </div>
  );
}

function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page));
        router.push(`${pathname}?${params.toString()}`);
    };

    // Logic to generate page numbers (e.g., 1 ... 4 5 6 ... 10)
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) {
                pages.push('...');
            }
            if (currentPage > 2) {
                pages.push(currentPage - 1);
            }
            if (currentPage !== 1 && currentPage !== totalPages) {
                pages.push(currentPage);
            }
            if (currentPage < totalPages - 1) {
                pages.push(currentPage + 1);
            }
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            pages.push(totalPages);
        }
        return [...new Set(pages)]; // Remove duplicates that can occur with ellipsis
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex items-center justify-center mt-12 space-x-2">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100"
            >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" />
            </button>
            {pageNumbers.map((page, index) =>
                typeof page === 'number' ? (
                    <button
                        key={index}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-md text-sm ${
                            currentPage === page
                                ? 'bg-amber-500 text-white font-semibold'
                                : 'bg-white hover:bg-stone-100'
                        }`}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={index} className="px-2 py-2 text-sm text-stone-400">
                        {page}
                    </span>
                )
            )}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100"
            >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" />
            </button>
        </nav>
    );
}

// Main Page Component
export default function TypePage() {
  const params = useParams();
  const type = (Array.isArray(params.type) ? params.type[0] : params.type as string);

  if (!type) return <div className="text-center py-20">Loading category...</div>;
  
  const displayType = type.replace('-', ' ');

  return (
    <div className="bg-white">
      <div className="relative h-60 bg-stone-800">
        <Image fill src="/images/hero-dates.jpg" alt={`${displayType} background`} className="object-cover opacity-30" priority />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <FilterSidebar />
          <main className="lg:col-span-3">
              <Suspense fallback={<LoadingSpinner />}>
                <ProductGrid />
              </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}