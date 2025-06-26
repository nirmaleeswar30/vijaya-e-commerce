// components/QuantitySelector.tsx
'use client';

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export default function QuantitySelector({ quantity, setQuantity }: QuantitySelectorProps) {
  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(Math.max(1, quantity - 1)); // Prevents going below 1

  return (
    <div className="flex items-center">
      <label htmlFor="quantity" className="mr-4 text-sm font-medium text-stone-700">QTY</label>
      <div className="flex items-center rounded-md border border-stone-300">
        <button type="button" onClick={decrement} className="px-3 py-1 text-lg text-stone-600 hover:bg-stone-100 rounded-l-md">-</button>
        <span className="w-10 text-center text-sm font-medium text-stone-800">{quantity}</span>
        <button type="button" onClick={increment} className="px-3 py-1 text-lg text-stone-600 hover:bg-stone-100 rounded-r-md">+</button>
      </div>
    </div>
  );
}