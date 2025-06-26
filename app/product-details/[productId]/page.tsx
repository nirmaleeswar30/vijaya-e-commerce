// app/product-details/[productId]/page.tsx
import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductInteractivePanel from './ProductInteractivePanel';

export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    images: string[];
    variants: {
        weight?: string[];
        size?: string[];
    } | null;
}

export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
    // --- FIX: Moved data fetching logic directly into the component ---
    const productId = params.productId;
    let product: Product | null = null;

    try {
        const client = await pool.connect();
        const result = await client.query<Product>('SELECT * FROM "Products" WHERE id = $1', [productId]);
        if (result.rows.length > 0) {
            product = result.rows[0];
        }
        client.release();
    } catch (error) {
        console.error("Failed to fetch product details:", error);
    }
    // --- END OF FIX ---

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="py-6 text-sm text-stone-500">
                    <Link href="/" className="hover:text-stone-800">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/products/all" className="hover:text-stone-800">Products</Link>
                    <span className="mx-2">/</span>
                    <span className="text-stone-800">{product.name}</span>
                </div>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-16">
                    {/* Image Column */}
                    <div>
                        <div className="aspect-square relative rounded-lg overflow-hidden border border-stone-200">
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Details Column */}
                    <ProductInteractivePanel product={product} />
                </div>
            </div>
        </div>
    );
}