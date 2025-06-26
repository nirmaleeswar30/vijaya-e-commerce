// app/orders/[orderId]/page.tsx
import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import ClearCartOnMount from './ClearCartOnMount'; // We will fix this next

// Types remain the same
interface OrderItem {
    quantity: number;
    price: number;
    name: string;
    images: string[];
}
interface OrderDetails {
    id: string;
    amount: number;
    status: string;
    shippingAddress: { name: string; email: string; address: string; city: string; pincode: string; phone: string; };
    items: OrderItem[];
}

const formatPrice = (priceInPaise: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(priceInPaise / 100);
};

export default async function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
    
    // --- DATABASE LOGIC MOVED DIRECTLY INTO THE COMPONENT ---
    const user = await currentUser();
    if (!user) {
        // This should not happen due to middleware, but it's a good safeguard
        notFound();
    }

    let order: OrderDetails | null = null;
    const client = await pool.connect();
    try {
        const orderQuery = `
            SELECT 
                o.id, o.amount, o.status, o."shippingAddress",
                oi.quantity, oi.price,
                p.name, p.images
            FROM "Orders" o
            JOIN "OrderItems" oi ON o.id = oi."orderId"
            JOIN "Products" p ON oi."productId" = p.id
            WHERE o.id = $1 AND o."userId" = $2;
        `;
        // Use params.orderId directly here
        const result = await client.query(orderQuery, [params.orderId, user.id]);

        if (result.rows.length > 0) {
            order = {
                id: result.rows[0].id,
                amount: result.rows[0].amount,
                status: result.rows[0].status,
                shippingAddress: result.rows[0].shippingAddress,
                items: result.rows.map(row => ({
                    quantity: row.quantity,
                    price: row.price,
                    name: row.name,
                    images: row.images
                }))
            };
        }
    } catch (error) {
        console.error("Failed to get order details:", error);
    } finally {
        client.release();
    }
    // --- END OF DATABASE LOGIC ---

    if (!order) {
        notFound();
    }

    return (
        <>
            <div className="bg-amber-50 min-h-screen">
                <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h1 className="mt-4 text-3xl font-bold text-gray-900">Thank You For Your Order!</h1>
                        <p className="mt-2 text-gray-600">Your order status is: <span className="font-semibold uppercase">{order.status}</span></p>
                        <p className="mt-1 text-sm text-gray-500">Order ID: <span className="font-mono">{order.id}</span></p>

                        <div className="mt-8 text-left border-t pt-6">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <ul className="divide-y divide-gray-200">
                                {order.items.map((item, index) => (
                                    <li key={index} className="py-4 flex">
                                        <Image src={item.images[0]} alt={item.name} width={64} height={64} className="rounded-md" />
                                        <div className="ml-4 flex-1">
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-4 border-t flex justify-between font-bold text-lg">
                                <span>Total Paid</span>
                                <span>{formatPrice(order.amount)}</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-left border-t pt-6">
                            <h2 className="text-xl font-semibold mb-4">Shipping to:</h2>
                            <p className="font-medium">{order.shippingAddress.name}</p>
                            <p className="text-gray-600">{order.shippingAddress.address}</p>
                            <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                            <p className="text-gray-600">Email: {order.shippingAddress.email}</p>
                            <p className="text-gray-600">Phone: {order.shippingAddress.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* This component will handle clearing the cart */}
            <ClearCartOnMount />
        </>
    );
}