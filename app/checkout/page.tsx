// // app/checkout/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useCart } from '@/components/CartProvider';
// import { useUser } from '@clerk/nextjs';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link'; // <-- THE MISSING IMPORT

// const formatPrice = (priceInPaise: number) => {
//     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(priceInPaise / 100);
// };

// export default function CheckoutPage() {
//     const { cartItems, cartCount } = useCart();
//     const { user } = useUser(); // Get the currently signed-in user
//     const router = useRouter();

//     // State for loading indicator on the payment button
//     const [isLoading, setIsLoading] = useState(false);

//     // State for form inputs, pre-filled with Clerk user data if available
//     const [name, setName] = useState(user?.fullName || '');
//     const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || '');
//     const [address, setAddress] = useState('');
//     const [city, setCity] = useState('');
//     const [pincode, setPincode] = useState('');
//     const [phone, setPhone] = useState('');

//     const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

//     /**
//      * Handles the form submission to initiate the payment process.
//      */
//     const handlePayment = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);

//         try {
//             // Call our backend API to create the PhonePe transaction
//             const response = await fetch('/api/payment', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     name, email, phone, address, city, pincode, cartItems
//                 }),
//             });

//             const data = await response.json();

//             // If the API call is successful and returns a redirect URL...
//             if (data.success && data.redirectUrl) {
//                 // ...redirect the user to the PhonePe payment page.
//                 router.push(data.redirectUrl);
//             } else {
//                 // Handle errors from our API
//                 alert(`Payment initiation failed: ${data.error || 'An unknown error occurred.'}`);
//                 setIsLoading(false);
//             }
//         } catch (error) {
//             // Handle network or other unexpected errors
//             console.error("Failed to call payment API:", error);
//             alert("Could not connect to the payment service. Please try again later.");
//             setIsLoading(false);
//         }
//     };

//     // If the cart is empty, prevent checkout and show a message.
//     if (cartCount === 0 && !isLoading) { // Check isLoading to prevent flicker during redirect
//         return (
//             <div className="flex flex-col items-center justify-center text-center py-20 min-h-[60vh]">
//                 <h1 className="text-2xl font-bold text-brand-dark">Your Cart is Empty</h1>
//                 <p className="mt-2 text-gray-600">You must add items to your cart before you can check out.</p>
//                 <Link href="/shop" className="mt-6 text-sm font-medium text-brand-yellow hover:text-yellow-600">
//                     ← Back to Shop
//                 </Link>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-brand-bg">
//             <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
//                 <h1 className="text-3xl font-bold text-brand-dark mb-8 text-center">Checkout</h1>
                
//                 <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
//                     {/* Column 1: Shipping Details Form */}
//                     <div className="md:col-span-1">
//                         <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
//                         <div className="space-y-4">
//                             <div>
//                                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
//                                 <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow sm:text-sm p-2" />
//                             </div>
//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//                                 <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow sm:text-sm p-2" />
//                             </div>
//                             <div>
//                                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
//                                 <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow sm:text-sm p-2" />
//                             </div>
//                             <div>
//                                 <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
//                                 <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow sm:text-sm p-2" />
//                             </div>
//                             <div>
//                                 <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
//                                 <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow sm:text-sm p-2" />
//                             </div>
//                             <div>
//                                 <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
//                                 <input type="text" id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-yellow focus:ring-brand-yellow sm:text-sm p-2" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Column 2: Order Summary */}
//                     <div className="md:col-span-1 mt-10 md:mt-0">
//                         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//                         <div className="border border-gray-200 rounded-lg p-4 bg-white">
//                             <ul className="divide-y divide-gray-200">
//                                 {cartItems.map(item => (
//                                     <li key={item.id} className="py-4 flex items-center">
//                                         <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" />
//                                         <div className="ml-4 flex-1">
//                                             <p className="font-medium">{item.name}</p>
//                                             <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                                         </div>
//                                         <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
//                                     </li>
//                                 ))}
//                             </ul>
//                             <div className="border-t border-gray-200 mt-4 pt-4">
//                                 <div className="flex justify-between">
//                                     <p className="text-gray-600">Subtotal</p>
//                                     <p>{formatPrice(subtotal)}</p>
//                                 </div>
//                                 <div className="flex justify-between mt-2">
//                                     <p className="text-gray-600">Shipping</p>
//                                     <p>FREE</p>
//                                 </div>
//                                 <div className="flex justify-between font-bold text-lg mt-4">
//                                     <p>Total</p>
//                                     <p>{formatPrice(subtotal)}</p>
//                                 </div>
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="w-full mt-6 bg-brand-yellow text-brand-dark font-bold py-3 rounded-md hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                 disabled={isLoading}
//                             >
//                                 {isLoading ? 'Processing...' : 'Proceed to Payment'}
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// app/checkout/page.tsx

// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define types for clarity
interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  discountValue?: number;
}

const formatPrice = (priceInPaise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(priceInPaise / 100);

export default function CheckoutPage() {
    const { cartItems, cartCount } = useCart();
    const { user } = useUser();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || '');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    
    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'FIXED_AMOUNT' && appliedCoupon.discountValue) {
            discountAmount = appliedCoupon.discountValue;
        } else if (appliedCoupon.discountType === 'PERCENTAGE' && appliedCoupon.discountValue) {
            discountAmount = subtotal * (appliedCoupon.discountValue / 100);
        }
    }
    const totalAmount = Math.max(0, subtotal - discountAmount);
    
    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, subtotal }),
            });
            const data = await res.json();
            if (data.success) {
                setAppliedCoupon(data.coupon);
                setCouponCode('');
            } else {
                setCouponError(data.message);
                setAppliedCoupon(null);
            }
        } catch (error) {
            setCouponError('Could not connect to the server.');
        } finally {
            setCouponLoading(false);
        }
    };

    const processPayment = async (isMock: boolean = false) => {
        if (!name || !email || !phone || !address || !city || !pincode) {
            alert("Please fill in all shipping details.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, email, phone, address, city, pincode, cartItems, isMockPayment: isMock,
                    appliedCouponCode: appliedCoupon?.code, // Pass the applied coupon code
                }),
            });
            const data = await response.json();
            if (data.success && data.redirectUrl) {
                router.push(data.redirectUrl);
            } else {
                alert(`Payment initiation failed: ${data.error || 'An unknown error occurred.'}`);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Failed to call payment API:", error);
            alert("Could not connect to the payment service. Please try again later.");
            setIsLoading(false);
        }
    };

    if (cartCount === 0 && !isLoading) { /* ... same as before ... */ }

    return (
        <div className="bg-stone-50">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-brand-dark mb-8 text-center">Checkout</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    {/* Shipping Details Form ... same as before ... */}
                    <div className="md:col-span-1">...</div>
                    
                    {/* Order Summary */}
                    <div className="md:col-span-1 mt-10 md:mt-0">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="border border-stone-200 rounded-lg p-4 bg-white">
                            <ul> {/* ... cartItems map ... */} </ul>
                            <div className="border-t border-stone-200 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-stone-600"><p>Subtotal</p><p>{formatPrice(subtotal)}</p></div>
                                
                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <p>Discount ({appliedCoupon.code})</p>
                                        <p>- {formatPrice(discountAmount)}</p>
                                    </div>
                                )}

                                <div className="flex justify-between text-stone-600"><p>Shipping</p><p>{appliedCoupon?.discountType === 'FREE_SHIPPING' ? 'FREE' : 'Calculated later'}</p></div>
                                
                                <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2"><p>Total</p><p>{formatPrice(totalAmount)}</p></div>
                            </div>

                            {/* Coupon Input */}
                            <div className="mt-6">
                                <label htmlFor="coupon-code" className="block text-sm font-medium text-stone-700">Coupon Code</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="VIJAYAFS" className="block w-full rounded-l-md border-stone-300 focus:ring-amber-500 focus:border-amber-500" />
                                    <button type="button" onClick={handleApplyCoupon} disabled={couponLoading} className="bg-stone-200 px-4 text-sm font-medium text-stone-700 rounded-r-md hover:bg-stone-300 disabled:opacity-50">
                                        {couponLoading ? '...' : 'Apply'}
                                    </button>
                                </div>
                                {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                                {appliedCoupon && <p className="text-green-600 text-sm mt-1">Coupon applied successfully!</p>}
                            </div>

                            {/* Payment Buttons */}
                            <div className="mt-6 space-y-3">
                                <button onClick={() => processPayment(false)} className="w-full bg-amber-500 text-white font-bold py-3 rounded-md ..." disabled={isLoading}>{isLoading ? 'Processing...' : 'Proceed to Payment'}</button>
                                {process.env.NODE_ENV === 'development' && (
                                    <button onClick={() => processPayment(true)} className="w-full bg-green-500 text-white font-bold py-3 rounded-md ..." disabled={isLoading}>{isLoading ? 'Processing...' : 'Mock Successful Payment'}</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}