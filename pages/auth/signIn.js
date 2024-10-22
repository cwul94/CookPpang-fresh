import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    // 에러 발생 시 홈으로 리다이렉트
    router.push('/');
  }, []);

  return null; // 아무 UI도 렌더링하지 않음
}
