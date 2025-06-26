// app/api/reviews/[productId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import pool from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- FIX 2: Correctly implement the GET handler ---
export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  // --- FIX 1: Access params directly ---
  const productId = params.productId;
  
  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM "Reviews" WHERE "productId" = $1 ORDER BY "createdAt" DESC', [productId]);
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { productId: string } }) {
  const { userId, sessionClaims } = getAuth(req);
  // --- FIX 1: Access params directly ---
  const productId = params.productId;

  if (!userId) { /* ... same as before ... */ }
  if (!productId) { return NextResponse.json({ error: 'Product ID is required' }, { status: 400 }); }

  try {
    // ... all the FormData and Cloudinary logic remains exactly the same ...
    const formData = await req.formData();
    const rating = formData.get('rating') as string;
    const comment = formData.get('comment') as string;
    const imageFile = formData.get('image') as File | null;

    if (!rating || !comment) {
        return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 });
    }

    let imageUrl: string | null = null;
    
    if (imageFile) {
        if (imageFile.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Image file size exceeds 5MB' }, { status: 400 });
        }
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: "vijaya_reviews", resource_type: "image" }, 
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            }).end(buffer);
        });
        // @ts-ignore
        if (uploadResult && uploadResult.secure_url) { imageUrl = uploadResult.secure_url; } 
        // @ts-ignore
        else { throw new Error(uploadResult.message || "Cloudinary upload failed."); }
    }

    const userName = sessionClaims?.username || sessionClaims?.fullName || 'Anonymous User';
    const client = await pool.connect();
    const query = 'INSERT INTO "Reviews" ("productId", "userId", "userName", rating, comment, "imageUrl") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const result = await client.query(query, [productId, userId, userName, parseInt(rating), comment, imageUrl]);
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Failed to post review:", error);
    // @ts-ignore
    return NextResponse.json({ error: 'Failed to post review', details: error.message }, { status: 500 });
  }
}