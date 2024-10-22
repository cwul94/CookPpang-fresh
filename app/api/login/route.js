"use server"

import { getDatabaseConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(req) {
    
    const { id, password } = await req.json();

    if (!id || !password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    try {
        const db = await getDatabaseConnection();

        const [rows] = await db.query('SELECT username, password FROM users WHERE username = ?', [id]);

        if (rows.length === 0) return NextResponse.json({ error: 'User Not Found' }, { status: 404 });

        const isValidPwd = await bcrypt.compare(password, rows[0].password);

        if (isValidPwd) {
            const [userRows] = await db.query('SELECT user_id,email,address,address_detail FROM users WHERE username = ?', [id]);

            if (userRows.length === 0) {
                db.release();
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const userId = userRows[0].user_id;
            const email = userRows[0].email;
            const address = userRows[0].address;
            const details = userRows[0].address_detail;

            // Fetch cart, interest, and orders data
            const [cartRows] = await db.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
            const [interestRows] = await db.query('SELECT * FROM interest WHERE user_id = ?', [userId]);
            const [orderRows] = await db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);

            db.release();

            return NextResponse.json({
                username: rows[0].username,
                email: email,
                address: address,
                details: details,
                carts: cartRows,
                interests: interestRows,
                orders: orderRows,
            });
        } else {
            db.release();
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
