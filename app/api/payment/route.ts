// // app/api/payment/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getAuth } from '@clerk/nextjs/server';
// import { v4 as uuidv4 } from 'uuid';
// import sha256 from 'crypto-js/sha256';
// import pool from '@/lib/db';

// export async function POST(req: NextRequest) {
//   try {
//     // 1. AUTHENTICATION & DATA EXTRACTION
//     const { userId } = getAuth(req);
//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { name, email, phone, address, city, pincode, cartItems } = await req.json();
    
//     if (!cartItems || cartItems.length === 0) {
//       return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
//     }

//     // 2. CALCULATE TOTAL AMOUNT & PREPARE ORDER DATA
//     const amount = cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
//     const merchantTransactionId = `M${Date.now()}`; // Unique transaction ID
//     const orderId = uuidv4(); // Unique order ID for our database

//     // 3. SAVE THE ORDER TO YOUR DATABASE (as PENDING)
//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN'); // Start transaction

//         const shippingAddress = { name, email, phone, address, city, pincode };
        
//         const orderQuery = 'INSERT INTO "Orders" (id, "userId", amount, status, "shippingAddress") VALUES ($1, $2, $3, $4, $5)';
//         await client.query(orderQuery, [orderId, userId, amount, 'PENDING', shippingAddress]);

//         for (const item of cartItems) {
//             const itemQuery = 'INSERT INTO "OrderItems" ("orderId", "productId", quantity, price) VALUES ($1, $2, $3, $4)';
//             await client.query(itemQuery, [orderId, item.id, item.quantity, item.price]);
//         }

//         await client.query('COMMIT'); // Commit transaction
//     } catch (dbError) {
//         await client.query('ROLLBACK'); // Rollback on error
//         console.error('Database Error:', dbError);
//         return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
//     } finally {
//         client.release();
//     }

//     // 4. PREPARE THE PHONEPE PAYLOAD
//     const paymentData = {
//         merchantId: process.env.PHONEPE_MERCHANT_ID,
//         merchantTransactionId: merchantTransactionId,
//         merchantUserId: `U${userId}`,
//         amount: amount, // Amount in paise
//         redirectUrl: `http://localhost:3000/orders/${orderId}`, // URL to redirect after payment
//         redirectMode: 'POST',
//         callbackUrl: `http://localhost:3000/api/payment/callback`, // PhonePe will send a server-to-server notification here
//         mobileNumber: phone,
//         paymentInstrument: { type: 'PAY_PAGE' },
//     };

//     const payload = JSON.stringify(paymentData);
//     const payloadBase64 = Buffer.from(payload).toString('base64');
//     const saltKey = process.env.PHONEPE_SALT_KEY;
//     const saltIndex = process.env.PHONEPE_SALT_INDEX;

//     // 5. GENERATE THE X-VERIFY SIGNATURE
//     const stringToHash = `${payloadBase64}/pg/v1/pay${saltKey}`;
//     const sha256Hash = sha256(stringToHash);
//     const xVerify = `${sha256Hash}###${saltIndex}`;

//     // 6. MAKE THE API CALL TO PHONEPE
//     const response = await fetch(`${process.env.PHONEPE_HOST_URL}/pg/v1/pay`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-VERIFY': xVerify,
//       },
//       body: JSON.stringify({ request: payloadBase64 }),
//     });

//     const responseData = await response.json();

//     // 7. RETURN THE PAYMENT URL TO THE FRONTEND
//     if (responseData.success && responseData.data.instrumentResponse.redirectInfo.url) {
//         return NextResponse.json({ success: true, redirectUrl: responseData.data.instrumentResponse.redirectInfo.url });
//     } else {
//         console.error('PhonePe API Error:', responseData);
//         return NextResponse.json({ success: false, error: 'Could not initiate payment' }, { status: 500 });
//     }
//   } catch (error) {
//     console.error('Server Error:', error);
//     return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
//   }
// }


// app/api/payment/route.ts
// app/api/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';
import sha256 from 'crypto-js/sha256';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, phone, address, city, pincode, cartItems, isMockPayment, appliedCouponCode } = await req.json();
    
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
    let finalAmount = subtotal;
    let validCoupon = null;

    // --- SERVER-SIDE COUPON RE-VALIDATION ---
    if (appliedCouponCode) {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM "Coupons" WHERE code = $1 AND "isActive" = true', [appliedCouponCode]);
        client.release();
        const coupon = result.rows[0];

        if (coupon && (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount)) {
            validCoupon = coupon;
            if (coupon.discountType === 'FIXED_AMOUNT') {
                finalAmount = Math.max(0, subtotal - coupon.discountValue);
            } else if (coupon.discountType === 'PERCENTAGE') {
                finalAmount = Math.max(0, subtotal - (subtotal * coupon.discountValue / 100));
            }
            // For FREE_SHIPPING, the amount remains the same, but we'd handle shipping cost elsewhere
        }
    }

    const orderId = uuidv4();

    // Save the order to your database
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const shippingAddress = { name, email, phone, address, city, pincode };
        const orderStatus = isMockPayment ? 'COMPLETED' : 'PENDING';
        
        const orderQuery = 'INSERT INTO "Orders" (id, "userId", amount, status, "shippingAddress", "couponCode") VALUES ($1, $2, $3, $4, $5, $6)';
        await client.query(orderQuery, [orderId, userId, finalAmount, orderStatus, shippingAddress, validCoupon?.code || null]);

        for (const item of cartItems) {
            const itemQuery = 'INSERT INTO "OrderItems" ("orderId", "productId", quantity, price) VALUES ($1, $2, $3, $4)';
            await client.query(itemQuery, [orderId, item.id, item.quantity, item.price]);
        }
        await client.query('COMMIT');
    } catch (dbError) {
        await client.query('ROLLBACK');
        console.error('Database Error:', dbError);
        return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    } finally {
        client.release();
    }

    if (isMockPayment) {
        const redirectUrl = `http://localhost:3000/orders/${orderId}`;
        return NextResponse.json({ success: true, redirectUrl: redirectUrl });
    }

    // PhonePe Payload Preparation
    const merchantTransactionId = `M${Date.now()}`;
    const paymentData = {
        merchantId: process.env.PHONEPE_MERCHANT_ID,
        merchantTransactionId,
        merchantUserId: `U${userId}`,
        amount: finalAmount, // Use the final discounted amount
        redirectUrl: `http://localhost:3000/orders/${orderId}`,
        redirectMode: 'POST',
        callbackUrl: `http://localhost:3000/api/payment/callback`,
        mobileNumber: phone,
        paymentInstrument: { type: 'PAY_PAGE' },
    };

    const payload = JSON.stringify(paymentData);
    const payloadBase64 = Buffer.from(payload).toString('base64');
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const stringToHash = `${payloadBase64}/pg/v1/pay${saltKey}`;
    const sha256Hash = sha256(stringToHash);
    const xVerify = `${sha256Hash}###${saltIndex}`;

    // Make the API call to PhonePe
    const response = await fetch(`${process.env.PHONEPE_HOST_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-VERIFY': xVerify, },
      body: JSON.stringify({ request: payloadBase64 }),
    });
    const responseData = await response.json();

    if (responseData.success && responseData.data.instrumentResponse.redirectInfo.url) {
        return NextResponse.json({ success: true, redirectUrl: responseData.data.instrumentResponse.redirectInfo.url });
    } else {
        console.error('PhonePe API Error:', responseData);
        return NextResponse.json({ success: false, error: 'Could not initiate payment' }, { status: 500 });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}