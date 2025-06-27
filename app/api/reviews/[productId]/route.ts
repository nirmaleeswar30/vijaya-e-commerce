// app/api/reviews/[productId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM "Reviews" WHERE "productId" = $1 ORDER BY "createdAt" DESC',
      [productId]
    );
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}