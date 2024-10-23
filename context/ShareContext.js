"use client"

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Cookies from "js-cookie";

// Create the context
export const ShareContext = createContext();

// Create the provider component
export function MyProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [mainCategoryNum, setMainCategoryNum] = useState(null);
  const [listCategoryNum, setListCategoryNum] = useState(null);
  const [infoCategoryNum, setInfoCategoryNum] = useState(null);
  const [comunityCategoryNum, setComunityCategoryNum] = useState(null);
  const [previousPath, setPreviousPath] = useState("");
  const [isRedirectedToJoin, setIsRedirectedToJoin] = useState(false);
  const [isCnction, setIsCnction] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { data:session, status } = useSession();

  // useEffect(() => {
  //   // 페이지가 변경될 때마다 현재 경로를 이전 경로로 업데이트합니다.
  //   const handleRouteChange = (url) => {
  //     setPreviousPath(url); // 이전 경로 저장
  //     console.log('이전경로저장 : ' + url);
  //   };

  //   // 현재 경로가 변경될 때마다 handleRouteChange 호출
  //   handleRouteChange(pathname);

  //   if ( status === 'authenticated' && previousPath === '/join' ) {
  //     console.log('회원가입 중 이탈.. 로그아웃');
  //     signOut({ callbackUrl: '/'}); // 로그아웃 처리
  //   }
  // }, [pathname]);

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     const currentPath = window.location.pathname;

  //     // 소셜 로그인 후 가입 페이지에 도달했는지를 추적
  //     if (currentPath === "/join") {
  //       console.log('회원가입페이지 요청 완료');
  //       setIsRedirectedToJoin(true);
  //     } else {
  //       // 가입 페이지를 벗어나면 로그아웃
  //       if (isRedirectedToJoin) {
  //         console.log('회원가입 중 이탈.. 로그아웃')
  //         signOut({ callbackUrl: '/'});
  //       }
  //     }
  //   }
  // }, [status, router.asPath]);

  // useEffect(() => {
  //   // 초기 로드 시 쿠키에서 사용자 정보 및 장바구니 정보 가져오기
  //   const savedUserInfo = Cookies.get('userInfo');
  //   if (savedUserInfo) {
  //     setUserInfo(JSON.parse(savedUserInfo));
  //   }
  // }, []);

  useEffect(() => {
    // Check if authenticated and user was redirected to /join
    if (status === 'authenticated' && pathname === '/join') {
      setIsRedirectedToJoin(true);
      console.log('회원가입 페이지로 리다이렉트 완료');
    }

    // If the user was redirected to /join and leaves without completing registration
    if (status === 'authenticated' && !isCnction && isRedirectedToJoin && pathname !== '/join') {
      if ( pathname === '/' ) {
        console.log('회원가입을 완료하지 않고 이탈, 로그아웃 처리');
        signOut({ redirect: false }) // redirect: false로 설정하여 명시적 리다이렉트를 방지
          .then(() => {
            router.push('/'); // 강제로 홈으로 리다이렉트
          });
      }
    }

  }, [pathname]);

  useEffect(() => {
    // 세션 로딩 중에는 리다이렉트하지 않음
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      // const infoCookie = Cookies.get('userInfo');
      const infoStorage = localStorage.getItem('userInfo');
      if(infoStorage) {
        updateUserInDB(userInfo,router);
      }
      return;
    }
    
    // 세션이 없거나 userData가 없으면 리다이렉트
    if (status === 'authenticated' && !session?.userData) {
      // console.log(session);
      router.push('/join');
      return;
    }
  
    // 쿠키에서 사용자 정보를 가져오고, 쿠키가 있는 경우 세션 사용자 정보를 업데이트
    // const infoCookie = Cookies.get('userInfo');
    
    const infoStorage = localStorage.getItem('userInfo');

    // 쿠키에서 정보 가져오기: JSON 파싱이 필요함
    if (status === 'authenticated' && session?.userData && infoStorage) {
      console.log('이미 로그인됨');
      const infoStorage = JSON.parse(localStorage.getItem('userInfo'));
      console.log(localStorage.getItem('userInfo'));
      if (infoStorage) {
        // console.log('쿠키에서 사용자 정보 로드');
        // console.log(infoCookie);
        console.log(userInfo);
        setUserInfo({
          userInfo: session?.userData.userInfo,
          cart: infoStorage?.cart,
          jjim: infoStorage?.jjim,
          order: session?.userData.order,
        })

        const addressStorage = localStorage.getItem('address');
        const detailsStorage = localStorage.getItem('address_details');
        if ( addressStorage ) {
          console.log(addressStorage);
          console.log(detailsStorage);
          setUserInfo( prevInfo => ({
            ...prevInfo,
            userInfo: {
              ...prevInfo.userInfo,
              address: addressStorage,
              address_detail: detailsStorage,
            }
          }))
        }
      }
      return;
    }

    function omit(obj, ...keys) {
      const result = { ...obj }
      keys.forEach(key => delete result[key])
      return result
    }

    const filteredInfo = omit(session?.userData, 'order', 'userInfo');
    
    const parsedUserData = JSON.stringify(filteredInfo);
    // Cookies.set('userInfo', parsedUserData);  // 쿠키에 사용자 정보 저장
    localStorage.setItem('userInfo', parsedUserData);
    setUserInfo(session?.userData); // 상태에 사용자 정보 저장
    console.log(session?.userData);
    // console.log(session);
    // console.log(status);
  }, [status]);
  
  useEffect(() => {
    // userInfo 상태가 업데이트될 때마다 쿠키에 저장
    // console.log(userInfo)
    // const infoCookie = Cookies.get('userInfo');
    const infoStorage = localStorage.getItem('userInfo');
    if (userInfo) {

      console.log(userInfo);

      function omit(obj, ...keys) {
        const result = { ...obj }
        keys.forEach(key => delete result[key])
        return result
      }
  
      const filteredInfo = omit(userInfo, 'order', 'userInfo');

      // Cookies.set('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('userInfo', JSON.stringify(filteredInfo));
      console.log('쿠키 등록함~');
      console.log(userInfo);
      console.log(infoStorage);
    }
    // console.log(session);
    // console.log(status);
  }, [userInfo]);
  
  useEffect(() => {
    console.log(userInfo);
  }, [])

  useEffect(() => {
    setListCategoryNum(0);
    setComunityCategoryNum(0);
    setInfoCategoryNum(0);

  }, [mainCategoryNum])

  return (
    <ShareContext.Provider value={{
      userInfo,
      setUserInfo,
      mainCategoryNum,
      setMainCategoryNum,
      listCategoryNum,
      setListCategoryNum,
      infoCategoryNum,
      setInfoCategoryNum,
      comunityCategoryNum,
      setComunityCategoryNum,
      previousPath,
      setPreviousPath,
      isCnction,
      setIsCnction,
      router,
      pathname,
      session,
      status,
    }}>
      {children}
    </ShareContext.Provider>
  );
}

// Custom hook for using the context
export function useShareContext() {
  return useContext(ShareContext);
}

async function updateUserInDB(userInfo,router) {
  try {
    const response = await fetch('/api/update-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userInfo?.userInfo?.username,
        email: userInfo?.userInfo?.email,
        address: userInfo?.userInfo?.address,
        details: userInfo?.userInfo?.address_detail,
        cart: userInfo?.cart,
        interest: userInfo?.jjim,
      }),
    });

    if (response.ok) {
      console.log('User information successfully updated in the database');
      signOut({ redirect:false }).then(()=>{
        // Cookies.remove('userInfo'); // 로그아웃 시 쿠키 삭제
        localStorage.removeItem('userInfo');
        router.push('/');
      })
    } else {
      console.error('Failed to update user information in the database');
    }
  } catch (error) {
    console.error('Error during API request:', error);
  }
}
