// components/Categories.tsx
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: "Dates", image: "/images/products/ajwa-dates.jpg", count: "25+ varieties", href: "/products/dates" },
  { name: "Almonds", image: "/images/products/almonds-new.jpg", count: "15+ types", href: "/products/nuts" },
  { name: "Cashews", image: "/images/products/cashews-new.jpg", count: "10+ grades", href: "/products/nuts" },
  { name: "Walnuts", image: "/images/products/walnuts.jpg", count: "8+ varieties", href: "/products/nuts" },
  { name: "Pistachios", image: "/images/products/pistachios.jpg", count: "12+ types", href: "/products/nuts" },
  { name: "Gift Boxes", image: "/images/products/cat-gift.jpg", count: "20+ combos", href: "/products/all" }
];

export default function Categories() {
  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of premium products, carefully categorized for your convenience.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link href={category.href} key={category.name} className="group">
              <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center">
                <div className="relative overflow-hidden rounded-xl mb-4 h-24">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill style={{objectFit: "cover"}}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}