// app/api/product/[productId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// This is optional but good practice for API routes. It tells Next.js
// which product IDs exist and can help with performance.
export async function generateStaticParams() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id FROM "Products"');
    client.release();
    return result.rows.map((product) => ({
      productId: product.id,
    }));
  } catch {
    return [];
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  // This is now safe because of generateStaticParams
  const { productId } = params;

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    // Updated query to get the single price from the "Products" table
    const productQuery = 'SELECT * FROM "Products" WHERE id = $1';
    const productResult = await client.query(productQuery, [productId]);
    client.release();

    if (productResult.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(productResult.rows[0]);

  } catch (error) {
    console.error('API Error - Failed to fetch product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}