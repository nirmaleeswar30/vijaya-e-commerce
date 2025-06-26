// app/api/coupons/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Coupon code is required.' }, { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query('SELECT * FROM "Coupons" WHERE code = $1 AND "isActive" = true', [code.toUpperCase()]);
    client.release();

    const coupon = result.rows[0];

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid coupon code.' }, { status: 404 });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ success: false, message: 'This coupon has expired.' }, { status: 400 });
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      const requiredAmount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(coupon.minOrderAmount / 100);
      return NextResponse.json({ success: false, message: `A minimum order of ${requiredAmount} is required to use this coupon.` }, { status: 400 });
    }
    
    // If all checks pass, return the valid coupon details
    return NextResponse.json({ success: true, coupon });

  } catch (error) {
    console.error('[COUPON_VALIDATE_ERROR]', error);
    return NextResponse.json({ success: false, message: 'An internal error occurred.' }, { status: 500 });
  }
}