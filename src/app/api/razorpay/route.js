// app/api/razorpay/route.js
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto"; // This is built-in to Node.js

const razorpay = new Razorpay({
  key_id: "rzp_test_RnA0qucHHHkFWN",
  key_secret: "YlD0lM4HwipWjr1HN0ncz3lh",
});

export async function POST(req) {
  try {
    const { amount } = await req.json();

    const options = {
      amount: (amount * 100).toString(), // Razorpay expects amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `receipt_${crypto.randomUUID().slice(0, 8)}`, // Generates a unique ID
    };

    const response = await razorpay.orders.create(options);
    
    return NextResponse.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}