"use server"

import { getDatabaseConnection } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
//   const session = await getSession({ req });

//   if (!session) {
//     return res.status(401).json({ message: 'Not Authenticated' });
//   }

  const { email,address,details } = await req.json();

  console.log(address,email,details);


  if (!address && !details) {
    return NextResponse.json({ error: '주소가 입력되지 않았습니다.' },{status:400});
  }

  try {
    const db = await getDatabaseConnection();

    // MySQL 쿼리 작성
    const [result] = await db.execute(
      'UPDATE users SET address = ?, address_detail = ? WHERE email = ?',
      [address, details, email]
    );

    if (result.length === 0) return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 404 });

    return NextResponse.json({ message: '주소가 저장되었습니다.' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500});
  }
}