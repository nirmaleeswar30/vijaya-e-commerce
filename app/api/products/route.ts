// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  const type = searchParams.get('type');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const inStock = searchParams.get('inStock');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 12;
  const offset = (page - 1) * limit;

  let whereClauses: string[] = [];
  let queryParams: any[] = [];
  let paramIndex = 1;

  if (type && type.toLowerCase() !== 'all') {
    whereClauses.push(`"category" ILIKE $${paramIndex++}`);
    queryParams.push(type);
  }
  if (minPrice) {
    whereClauses.push(`price >= $${paramIndex++}`);
    queryParams.push(parseInt(minPrice, 10));
  }
  if (maxPrice) {
    whereClauses.push(`price <= $${paramIndex++}`);
    queryParams.push(parseInt(maxPrice, 10));
  }
  if (inStock === 'true') {
    whereClauses.push(`"inStock" = $${paramIndex++}`);
    queryParams.push(true);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  try {
    const client = await pool.connect();
    
    const productsQuery = `
      SELECT * FROM "Products"
      ${whereString}
      ORDER BY "createdAt" DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    const productsResult = await client.query(productsQuery, [...queryParams, limit, offset]);

    const countQuery = `SELECT COUNT(*) FROM "Products" ${whereString}`;
    const countResult = await client.query(countQuery, queryParams);
    
    client.release();

    const totalProducts = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalProducts / limit);

    // ALWAYS return this object structure
    return NextResponse.json({
      products: productsResult.rows,
      currentPage: page,
      totalPages: totalPages,
    });

  } catch (error) {
    console.error('API Error - Failed to fetch products:', error);
    return NextResponse.json({ 
        message: "Error fetching products", 
        products: [], // Return empty array on error
        currentPage: 1, 
        totalPages: 0 
    }, { status: 500 });
  }
}