"use server"

import { getDatabaseConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import client from '@/lib/redisClient';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    const { user, session } = await req.json();
    
    // const refresh = await client.hGetAll(`user:${user?.id}`);
    let refresh = await client.get('refresh_token');

    if ( !refresh ) {
        function generateRefreshToken(userId) {
            const refreshToken = jwt.sign(
              { id: userId },
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: '7d' } // refresh 토큰 7일 유효
            );
            return refreshToken;
        }

        
        refresh = generateRefreshToken(user?.email);
        console.log('jwt : ' + refresh);
    }
   
    const profileImg = await client.get('profile_img');

    if (!user.email || !user.nickname) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    try {
        const db = await getDatabaseConnection();

        // 이미 존재하는 이메일 확인
        const [existingUser] = await db.query('SELECT * FROM users WHERE loginform_id = ?', [session?.user?.session?.user?.id]);
        if (existingUser.length > 0) {
            db.release();
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        let hashedPassword = null;
        if (user.password) {
            hashedPassword = await bcrypt.hash(user.password, 10);
        }

        // 사용자 정보 삽입
        await db.query('INSERT INTO users(username, password, email, loginform, loginform_id, profile_img, refresh_token) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                       [user.nickname, hashedPassword, user.email, session?.provider, session?.user?.id, profileImg, refresh]);

        // 새로 생성된 사용자 조회
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [user.email]);

        db.release();
        await client.del("refresh_token"); // 토큰 삭제
        await client.disconnect();
        return NextResponse.json({ userInfo: rows[0] });

    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
