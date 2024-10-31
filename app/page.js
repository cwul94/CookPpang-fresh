"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useShareContext } from "@/context/ShareContext";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {

  const name = 'lmcwul';

  const { userInfo, setUserInfo, setMainCategoryNum, session, status, router} = useShareContext();

  // 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState(false);

  const toggleVisibility = () => {
    setVisibility(!visibility);
  }

  const loginHandler = async (e) => {
    const res = await signIn('credentials', {
      redirect: false, // 로그인 성공 시 리다이렉트 비활성화
      email,
      password,
    });

    if (res?.error) {
      if ( res?.error === '비밀번호를 확인해주세요.') {
        const password = document.getElementById('password');
        password.focus();
      }
      alert(res.error);
    } else {
      // 로그인 성공 시 처리
      window.location.href = '/'; // 로그인 성공 후 리다이렉트
    }
  };

  const keyPressHandler = (e) =>{
    if(e.key == 'Enter') loginHandler();
  }

  const logoutHandler = () => {

    // signOut();
    // return;
    setMainCategoryNum(0);
    setUserInfo(null);
    updateUserInDB(session,userInfo,router);
  }

  return (
    <div>
      { userInfo && status === 'authenticated' && (
        <div className="login-success">
          { userInfo?.userInfo?.profile_img &&
            <Image src={userInfo?.userInfo?.profile_img}
                  alt="profile_img" // 이미지 설명
                  width={100} // 이미지 너비
                  height={100} // 이미지 높이
                  style={{ borderRadius:'50%'}}
                  priority
            />
          }
          { !userInfo?.userInfo?.profile_img &&
            <FaUser size={100} color="white" />
          }
          <p>{userInfo?.userInfo?.username} 님 환영합니다</p>
          <div>
            <button onClick={logoutHandler}>로그아웃</button>
          </div>
        </div>
      )}
      { status === 'loading' && <LoadingMessage />}
      { status === 'unauthenticated' &&
        (
        // 로그인 폼 표시
        <div className="login">
          <h3>로그인</h3>
          <div className="login-box">
            <div>
              <input 
                type="email" 
                id="id" 
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={keyPressHandler}
                placeholder="아이디를 입력하세요"
              />
              <div>
                <input 
                  type={visibility ? 'text' : 'password'} 
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={keyPressHandler}
                  placeholder="비밀번호를 입력하세요"
                />
                <button onClick={toggleVisibility} 
                        tabIndex="-1"
                        aria-label="Toggle password visibility">
                  {visibility ? <IoEyeOffSharp/> : <IoEyeSharp/>}
                </button>
              </div>
            </div>
            <button onClick={loginHandler}>로그인</button>
          </div>
          <div className="join-btn">
            <p>계정이 없으신가요?</p>
            <Link href="/join" onClick={()=>setMainCategoryNum(6)}>회원가입</Link>
          </div>
          <div className="social-login">
            <div>
              <Image src="/images/social_kakao_medium_small.png"
                    onClick={()=>signIn('kakao')}
                    alt="kakao_login_logo"
                    width={200} 
                    height={50}
                    style={{ cursor:'pointer', scale:'0.8' }}
                    priority
              />
              <Image src="/images/social_naver.png"
                    onClick={()=>signIn('naver')}
                    alt="naver_login_logo"
                    width={200} 
                    height={50}
                    style={{ cursor:'pointer', scale:'0.8' }}
                    priority
              />
            </div>
            <div>
              <Image src="/images/social_google.png"
                    onClick={()=>signIn('google')}
                    alt="google_login_logo"
                    width={230}
                    height={50}
                    style={{ cursor:'pointer', scale:'0.8' }}
                    priority
              />
            </div>
          </div>
        </div>
      )}
      {/* 페이지 제목 */}
      <h4 className="title">쿸빵 by {name}</h4>
    </div>
  );
}

function LoadingMessage() {

  const [dots, setDots] = useState("...");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return prevDots + "."; // 점 추가
        }
        return ""; // 점이 3개가 되면 초기화
      });
    }, 1000); // 1초마다 실행
  }, []);

  return (
    <div className="login-success">
      <p>정보를 불러오는 중{dots}</p>
    </div>
  );
}

async function updateUserInDB(session,userInfo,router) {
  try {
    const response = await fetch('/api/update-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: session?.userData?.userInfo?.username,
        email: session?.userData?.userInfo?.email,
        address: userInfo?.userInfo?.address,
        details: userInfo?.userInfo?.address_detail,
        cart: session?.userData?.cart,
        interest: session?.userData?.jjim,
      }),
    });

    if (response.ok) {
      signOut({ redirect:false}).then(()=>{
        localStorage.removeItem('userInfo');
        localStorage.removeItem('address');
        localStorage.removeItem('address_details');
        router.push('/');
      })
      console.log('User information successfully updated in the database');
    } else {
      console.error('Failed to update user information in the database');
    }
  } catch (error) {
    console.error('Error during API request:', error);
  }
}

