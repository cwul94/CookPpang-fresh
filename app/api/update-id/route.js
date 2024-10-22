"use server"

import { getDatabaseConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, changedId } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
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
    const success = await updateUserDataWithRetry(db, userId, changedId, 3); // 최대 3번 재시도
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

async function updateUserDataWithRetry(db, userId, changedId, maxRetries) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {

      await db.query('UPDATE USERS SET username = ? WHERE user_id = ?', [changedId,userId])

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
