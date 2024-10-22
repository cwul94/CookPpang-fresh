"use server"

import { getDatabaseConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { email } = await req.json();

    try {
        // 데이터베이스 연결 가져오기
        const db = await getDatabaseConnection();

        // 사용자 ID 중복 여부 확인
        const [rows] = await db.query('SELECT email FROM users WHERE email = ?', [email]);

        // 데이터베이스 연결 반환
        db.release();

        // 중복 ID가 있는 경우 응답
        if (rows.length > 0) {
            return NextResponse.json({ dupStatus: true });
        }

        // 중복 ID가 없는 경우 응답
        return NextResponse.json({ dupStatus: false });

    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
