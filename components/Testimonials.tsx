// components/Testimonials.tsx
import { Star } from 'lucide-react';

const testimonials = [
  { name: "Priya Sharma", location: "Mumbai", rating: 5, comment: "The quality is exceptional. Fresh, tasty, and delivered on time. Highly recommended!" },
  { name: "Rajesh Kumar", location: "Delhi", rating: 5, comment: "Consistent quality and excellent customer service. Best in the market!" },
  { name: "Anita Patel", location: "Bangalore", rating: 5, comment: "The Medjool dates are absolutely divine. Will order again for sure!" }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.comment}"</p>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}