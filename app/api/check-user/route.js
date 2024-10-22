"use server"

import { getDatabaseConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { email } = await req.json();

    // 이메일이 없는 경우 오류 응답
    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    let db;
    try {
        db = await getDatabaseConnection();

        // 데이터베이스 연결 확인
        if (!db) {
            console.error('Database connection failed');
            return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
        }

        // 이메일로 사용자 조회
        const [rows] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (!rows) {
            throw new Error('Query failed');
        }

        // 사용자가 존재하는지 여부를 boolean 값으로 설정
        const userExists = rows.length > 0;

        // 사용자가 존재하는 경우
        return NextResponse.json({ exists: userExists }, { status: 200 }); // boolean 값 반환
    } catch (error) {
        console.error('Request body:', req.body);
        console.error('Error querying the database:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        // 데이터베이스 연결 해제
        if (db) {
            db.release();
        }
    }
}
