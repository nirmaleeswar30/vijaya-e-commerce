// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server'; // auth is correct here
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  // --- THIS IS THE FIX ---
  // We must 'await' the auth() call to get the session object.
  const session = await auth();
  const user = await currentUser();

  // Now we can safely access userId from the resolved session object.
  const userId = session.userId;
  // --- END OF FIX ---

  if (!userId || !user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in to post a review.' }, { status: 401 });
  }

  try {
    const { productId, rating, comment, imageUrl } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Product ID, rating, and comment are required.' }, { status: 400 });
    }
    
    // Construct a user name, falling back gracefully.
    const userName = user.fullName || `${user.firstName} ${user.lastName}`.trim() || user.username || 'Anonymous User';

    const client = await pool.connect();
    try {
        const query = 'INSERT INTO "Reviews" ("productId", "userId", "userName", rating, comment, "imageUrl") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const result = await client.query(query, [productId, userId, userName, rating, comment, imageUrl]);
        
        return NextResponse.json(result.rows[0], { status: 201 });

    } catch (dbError) {
        console.error("Database error while posting review:", dbError);
        // Provide a more specific error if it's a known constraint violation
        if ((dbError as any).code === '23503') { // Foreign key violation
            return NextResponse.json({ error: 'Invalid Product ID.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Could not save review to the database.' }, { status: 500 });
    } finally {
        client.release();
    }

  } catch (error) {
    console.error("Error processing POST request for review:", error);
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}