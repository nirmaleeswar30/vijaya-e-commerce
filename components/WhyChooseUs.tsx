// components/WhyChooseUs.tsx
import Image from 'next/image';
import { Check } from 'lucide-react';

const features = [
  "Premium quality products sourced directly from farms",
  "Rigorous quality testing and certification",
  "Hygienic packaging and storage facilities",
  "Pan-India delivery with express shipping",
  "24/7 customer support and satisfaction guarantee"
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose Vijaya?</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                For over four decades, we've been committed to bringing you the finest quality dry fruits and dates from around the world. Our legacy is built on trust, quality, and your satisfaction.
              </p>
            </div>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-96">
            <Image
              src="/images/why-us.jpg"
              alt="About Vijaya Dry Fruits"
              fill style={{objectFit: 'cover'}}
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}