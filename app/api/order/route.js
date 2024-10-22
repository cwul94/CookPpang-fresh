"use server"

import { getDatabaseConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, cart } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const db = await getDatabaseConnection();

  try {
    // Get user_id from users table based on the provided username (id)
    const [userRows] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);

    if (userRows.length === 0) {
      db.release();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userRows[0].user_id;

    // Update data with retry logic
    const success = await updateUserDataWithRetry(db, userId, cart, 3); // 최대 3번 재시도
    if (!success) {
      return NextResponse.json({ error: 'Failed to update data after multiple attempts' }, { status: 500 });
    }

    db.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function updateUserDataWithRetry(db, userId, carts, maxRetries) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      await db.query('START TRANSACTION');

      // Delete existing records
      await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);

        for (const cart of carts) {
            await db.query(
            'INSERT INTO orders (user_id, order_name, order_category, order_price, order_quantity, order_date, order_img, order_address, order_detail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, cart.order_name, cart.order_category, cart.order_price, cart.order_quantity, cart.order_date, cart.order_img, cart.order_address, cart.order_detail]
            );
            console.log(cart);
        }

      await db.query('COMMIT');
      return true;
    } catch (error) {
      if (error.errno === 1205) { // Lock wait timeout
        attempt++;
        console.warn(`Attempt ${attempt} failed, retrying...`);
        await db.query('ROLLBACK');
        continue;
      }
      await db.query('ROLLBACK');
      throw error;
    }
  }
  return false;
}
