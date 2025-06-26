// components/FilterSidebar.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const productTypes = ['Dates', 'Nuts', 'Dry Fruits', 'Spices', 'Snacks', 'Seeds'];
const MAX_PRICE = 5000;

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('minPrice') || '0') / 100,
    parseInt(searchParams.get('maxPrice') || String(MAX_PRICE*100)) / 100,
  ]);

  // --- URL UPDATE LOGIC (Combined) ---
  const handleFilterChange = (name: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams);

    // Handle multi-select checkboxes (like type)
    if (Array.isArray(value)) {
        params.delete(name);
        if (value.length > 0) {
            value.forEach(v => params.append(name, v));
        }
    } 
    // Handle single-select or toggle (like inStock)
    else {
        if (params.get(name) === value) {
            params.delete(name); // Toggle off if it's the same
        } else {
            params.set(name, value);
        }
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePriceChangeComplete = (value: number | number[]) => {
    const params = new URLSearchParams(searchParams);
    if (Array.isArray(value)) {
      params.set('minPrice', String(value[0] * 100));
      params.set('maxPrice', String(value[1] * 100));
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  const handleClearFilters = () => {
    setPriceRange([0, MAX_PRICE]);
    router.push(pathname);
  };

  // Get current filter values from URL for checked state
  const currentTypes = searchParams.getAll('type');
  const availability = searchParams.get('availability');

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-24 p-6 border border-stone-200 rounded-lg bg-white">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-lg font-semibold text-stone-900">FILTER</h2>
          <button onClick={handleClearFilters} className="text-sm text-amber-600 hover:text-amber-800 hover:underline">Clear All</button>
        </div>
        
        <div className="py-6 border-b">
          <h3 className="text-sm font-medium text-stone-800 mb-4">AVAILABILITY</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input id="in-stock" name="availability" type="checkbox" checked={availability === 'inStock'} onChange={() => handleFilterChange('availability', 'inStock')} className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
              <label htmlFor="in-stock" className="ml-3 text-sm text-stone-600">In stock</label>
            </div>
            <div className="flex items-center">
              <input id="out-of-stock" name="availability" type="checkbox" checked={availability === 'outOfStock'} onChange={() => handleFilterChange('availability', 'outOfStock')} className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
              <label htmlFor="out-of-stock" className="ml-3 text-sm text-stone-600">Out of stock</label>
            </div>
          </div>
        </div>

        <div className="py-6 border-b">
          <h3 className="text-sm font-medium text-stone-800 mb-4">PRICE</h3>
          <Slider
            range
            min={0}
            max={MAX_PRICE}
            value={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
            onChangeComplete={handlePriceChangeComplete}
            trackStyle={[{ backgroundColor: '#f59e0b' }]}
            handleStyle={[{ borderColor: '#f59e0b', backgroundColor: 'white' }, { borderColor: '#f59e0b', backgroundColor: 'white' }]}
            railStyle={{ backgroundColor: '#e5e7eb' }}
          />
          <p className="text-sm text-stone-500 mt-4">Price: Rs. {priceRange[0]} - Rs. {priceRange[1]}</p>
        </div>

        <div className="py-6">
          <h3 className="text-sm font-medium text-stone-800 mb-4">PRODUCT TYPE</h3>
          <div className="space-y-3">
            {productTypes.map((type) => (
              <div key={type} className="flex items-center">
                <input id={`type-${type}`} name="productType" type="checkbox" value={type} checked={currentTypes.includes(type)} onChange={() => {
                    const newTypes = currentTypes.includes(type) ? currentTypes.filter(t => t !== type) : [...currentTypes, type];
                    handleFilterChange('type', newTypes);
                }} className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                <label htmlFor={`type-${type}`} className="ml-3 text-sm text-stone-600">{type}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}