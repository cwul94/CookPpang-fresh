"use server"

import { getDatabaseConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(req) {
    
    const { email, password } = await req.json();

    if( !email || !password ) {
        return NextResponse.json({ error: 'All fields are required'}, { status: 400 });
    }

    try {
        const db = await getDatabaseConnection();
        const [prevPwd] = await db.query('SELECT password FROM USERS WHERE email = ?', [email]);
        const isPrevPwd = await bcrypt.compare(password,prevPwd[0].password);
        if(isPrevPwd) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('UPDATE USERS SET password = ? WHERE email = ?', [hashedPassword,email]);
        db.release();
        return NextResponse.json({ message: 'User registered successfully' });

    } catch (error) {

        console.error('Error during registration:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}