// app/page.tsx
import HeroSlider from "@/components/HeroSlider";
import ValueProposition from "@/components/IntroSection";
import ProductCard, { type Product } from "@/components/ProductCard";
import Categories from "@/components/Categories";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";

// This function fetches only your featured products for the homepage section
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch products");
    const allProducts: Product[] = await res.json();
    return allProducts.filter(p => p.isFeatured).slice(0, 4); // Show only the first 4 featured
  } catch (error) {
    console.error("[HOME_PAGE_ERROR]", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="bg-white">
      {/* Your existing hero section */}
      <HeroSlider />

      {/* The small bar with "Free Delivery", "Quality Assured", etc. */}
      <ValueProposition />

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our handpicked selection of finest products, loved by thousands of customers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Shop by Category Section */}
      <Categories />
      
      {/* Why Choose Us Section */}
      <WhyChooseUs />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}