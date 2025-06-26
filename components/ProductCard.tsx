// components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface ProductCardProps {
  product: Product;
}

const formatPrice = (priceInPaise: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(priceInPaise / 100);
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    // THIS IS THE CORRECTED LINK
    <Link href={`/product-details/${product.id}`} className="group">
      <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="mt-4 text-lg text-stone-800 font-semibold">{product.name}</h3>
      <p className="mt-1 text-md font-medium text-gray-700">{formatPrice(product.price)}</p>
    </Link>
  );
}