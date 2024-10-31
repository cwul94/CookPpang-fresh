"use server"

import { getDatabaseConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(req) {
    
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    try {
        const db = await getDatabaseConnection();

        const [rows] = await db.query('SELECT user_id,password FROM users WHERE email = ?', [email]);

        if (rows.length === 0) return NextResponse.json({ message: '계정을 찾을 수 없습니다.' }, { status: 404 });

        const isValidPwd = await bcrypt.compare(password, rows[0].password);

        db.release();

        if (isValidPwd) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
