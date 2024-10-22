"use server"

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { randomBytes } from 'crypto';
import { join } from 'path';

// 랜덤 시크릿 키 생성
const generateSecret = () => {
  return randomBytes(64).toString('hex'); // 64바이트 랜덤 문자열
};

export const addAccessSecretToEnv = () => {
    // .env 파일 경로 설정
    const envFilePath = join(__dirname, '../.env');
    
    // 기존 .env 파일 내용 읽기
    let envContent = '';
    if (existsSync(envFilePath)) {
      envContent = readFileSync(envFilePath, 'utf8');
    }
    
    // 시크릿 키 생성 및 .env 파일에 추가
    const secretKey = generateSecret();
    const secretKeyPattern = /ACCESS_TOKEN_SECRET=.*/;
    if (secretKeyPattern.test(envContent)) {
      envContent = envContent.replace(secretKeyPattern, `ACCESS_TOKEN_SECRET=${secretKey}`);
    } else {
      envContent += `ACCESS_TOKEN_SECRET=${secretKey}\n`; // 기존에 없으면 추가
    }
    
    // .env 파일에 저장
    writeFileSync(envFilePath, envContent, 'utf8');
    
    console.log(`Generated new secret key: ${secretKey}`);
   
};

export const addRefreshSecretToEnv = () => {
    // .env 파일 경로 설정
    const envFilePath = join(__dirname, '../.env');
    
    // 기존 .env 파일 내용 읽기
    let envContent = '';
    if (existsSync(envFilePath)) {
      envContent = readFileSync(envFilePath, 'utf8');
    }
    
    // 시크릿 키 생성 및 .env 파일에 추가
    const secretKey = generateSecret();
    const secretKeyPattern = /REFRESH_TOKEN_SECRET=.*/;
    if (secretKeyPattern.test(envContent)) {
      envContent = envContent.replace(secretKeyPattern, `REFRESH_TOKEN_SECRET=${secretKey}`);
    } else {
      envContent += `REFRESH_TOKEN_SECRET=${secretKey}\n`; // 기존에 없으면 추가
    }
    
    // .env 파일에 저장
    writeFileSync(envFilePath, envContent, 'utf8');
    
    console.log(`Generated new secret key: ${secretKey}`);
   
};