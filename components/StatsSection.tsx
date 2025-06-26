// components/StatsSection.tsx
import { BuildingStorefrontIcon, GlobeAltIcon, GiftIcon, SparklesIcon } from '@heroicons/react/24/outline';

const stats = [
  { id: 1, name: 'Number of Stores', value: '200+', icon: BuildingStorefrontIcon },
  { id: 2, name: 'Countries', value: '2', icon: GlobeAltIcon },
  { id: 3, name: 'Products', value: '5000+', icon: GiftIcon },
  { id: 4, name: 'Varieties of Premium Dates', value: '50', icon: SparklesIcon },
];

export default function StatsSection() {
  return (
    <div 
      className="relative bg-indigo-800 py-24 sm:py-32"
      style={{ backgroundImage: "url('/pattern.svg')" }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:pr-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              VIJAYA DATES AND NUTS
            </h2>
            <div className="w-20 h-1 bg-amber-400 mt-4 mb-6"></div>
            <p className="text-lg leading-8 text-indigo-200">
              Welcome to Vijaya, where an unwavering commitment with a heritage of quality that spans over 40 years. Enjoy our unique assortment of dates, harvested from our own organic farm in the Middle East, featuring over 50+ varieties.
            </p>
            <p className="mt-6 text-lg leading-8 text-indigo-200">
              Experience a world of luxury with our exquisitely curated collection of exotic fruits, nuts, and imported beverages. Our dedication to excellence transcends the realm of a mere store, making Vijaya the ultimate destination for dates, dry fruits, nuts, and more.
            </p>
          </div>

          {/* Right Column: Stats Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
            {stats.map((stat) => (
              <div key={stat.id} className="relative pl-16">
                <dt className="text-base leading-7 text-indigo-300 flex items-center">
                  <div className="absolute top-1 left-0 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-700">
                    <stat.icon className="h-7 w-7 text-amber-400" aria-hidden="true" />
                  </div>
                </dt>
                <dd className="text-4xl font-bold tracking-tight text-white">{stat.value}</dd>
                <p className="text-base text-indigo-300">{stat.name}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}