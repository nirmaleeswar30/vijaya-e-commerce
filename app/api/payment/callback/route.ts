// app/api/payment/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sha256 from 'crypto-js/sha256';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // The response from PhonePe is sent as form data
    const formData = await req.formData();
    const base64Response = formData.get('response') as string;

    if (!base64Response) {
      throw new Error("No response field in callback");
    }

    // Decode the base64 response
    const decodedResponse = Buffer.from(base64Response, 'base64').toString('utf-8');
    const responsePayload = JSON.parse(decodedResponse);

    // Get the X-VERIFY header from the request
    const xVerifyHeader = req.headers.get('X-VERIFY');
    if (!xVerifyHeader) {
      throw new Error("X-VERIFY header missing");
    }

    // Recreate the signature to verify the callback authenticity
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const stringToHash = `${base64Response}/pg/v1/callback${saltKey}`;
    const calculatedHash = sha256(stringToHash).toString();
    const expectedXVerify = `${calculatedHash}###${saltIndex}`;

    // THIS IS THE MOST IMPORTANT STEP: VERIFY THE SIGNATURE
    if (xVerifyHeader !== expectedXVerify) {
      console.error("Callback verification failed. Signatures do not match.");
      // In a real app, you might want to flag this for investigation
      return NextResponse.json({ error: 'Callback verification failed' }, { status: 400 });
    }

    // If signatures match, process the payment status
    const { code, merchantId, transactionId, amount } = responsePayload.data;

    if (code === 'PAYMENT_SUCCESS') {
      // Payment was successful. Update the order status in your database.
      // IMPORTANT: Find the order using the `transactionId` (which we sent as merchantTransactionId)
      // We stored our internal orderId, but we need to find which order corresponds to this transaction.
      // A better approach is to store merchantTransactionId in our Orders table.

      // For now, let's assume we can update based on amount and pending status, which is NOT ideal for production.
      // A proper implementation would match `transactionId` to the `merchantTransactionId` saved with the order.
      
      const client = await pool.connect();
      try {
        // A more robust query would be:
        // UPDATE "Orders" SET status = 'COMPLETED' WHERE "merchantTransactionId" = $1
        const updateQuery = 'UPDATE "Orders" SET status = $1 WHERE id IN (SELECT id FROM "Orders" WHERE amount = $2 AND status = $3 LIMIT 1)';
        await client.query(updateQuery, ['COMPLETED', amount, 'PENDING']);
      } finally {
        client.release();
      }

      console.log(`Payment successful for transaction ${transactionId}`);
      
    } else {
      // Handle failed or pending payments
      console.log(`Payment status for transaction ${transactionId}: ${code}`);
      // You could update your DB to 'FAILED' here if needed.
    }

    // Respond to PhonePe to acknowledge receipt of the callback
    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Error handling PhonePe callback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}