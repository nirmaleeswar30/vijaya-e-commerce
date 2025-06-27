// components/IntroSection.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, Award } from 'lucide-react';

export default function IntroSection() {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Premium <span className="text-amber-600">Dry Fruits</span> & Dates
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover the finest selection of handpicked dry fruits and dates, sourced directly from the best farms. Pure, natural, and packed with nutrition.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products/all" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/about" className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center">
                View Catalog
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center">
                <Truck className="h-6 w-6 text-amber-600 mr-2" />
                <span className="text-sm text-gray-600">Free Delivery</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-amber-600 mr-2" />
                <span className="text-sm text-gray-600">Quality Assured</span>
              </div>
              <div className="flex items-center">
                <Award className="h-6 w-6 text-amber-600 mr-2" />
                <span className="text-sm text-gray-600">Premium Grade</span>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative h-96">
            <Image
              src="/images/hero-secondary.jpg" // A new image for this section
              alt="Premium Dry Fruits and Dates" 
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              className="rounded-2xl shadow-2xl"
            />
            
          </div>

        </div>
      </div>
    </section>
  );
}