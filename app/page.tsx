// app/page.tsx
import HeroSlider from "@/components/HeroSlider";
import StatsSection from "@/components/StatsSection";
import ProductCard, { type Product } from "@/components/ProductCard";
import Link from "next/link";

/**
 * This is an async Server Component function that fetches product data.
 */
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/products`, { 
      cache: 'no-store' 
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    
    // --- THIS IS THE FIX ---
    // The API returns an object { products: [...] }, so we destructure it.
    const { products: allProducts } = await res.json();
    // --- END OF FIX ---

    // Ensure allProducts is an array before filtering
    if (!Array.isArray(allProducts)) {
        console.error("[HOME_PAGE_ERROR] Fetched data is not an array:", allProducts);
        return [];
    }

    // Filter the products to find only those marked as "featured"
    const featuredProducts = allProducts.filter(p => p.isFeatured);
    
    return featuredProducts;
  } catch (error) {
    console.error("[HOME_PAGE_ERROR] Could not fetch featured products:", error);
    return [];
  }
}


export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      <HeroSlider />
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Our Featured Collection
            </h2>
            <p className="mt-4 text-lg leading-8 text-stone-600">
              Hand-picked selections of our finest products. Taste and Eat!
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-center col-span-full text-stone-500">
                Featured products are currently unavailable. Please check back later.
              </p>
            )}
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/products/all"
              className="rounded-md bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
            <StatsSection />

    </div>
  );
}