"use server"

import { getDatabaseConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(req) {
    
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    try {
        const db = await getDatabaseConnection();

        const [rows] = await db.query('SELECT username, password FROM users WHERE email = ?', [email]);

        if (rows.length === 0) return NextResponse.json({ error: 'User Not Found' }, { status: 404 });

        const isValidPwd = await bcrypt.compare(password, rows[0].password);

        if (isValidPwd) {
            const [userRows] = await db.query('SELECT user_id,email FROM users WHERE email = ?', [email]);

            if (userRows.length === 0) {
                db.release();
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            db.release();

            return NextResponse.json({
                message: 'Valid credentials'
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
