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
      const infoCookie = Cookies.get('userInfo');
      if(infoCookie) {
        updateUserInDB(JSON.parse(infoCookie),router);
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
    const infoCookie = Cookies.get('userInfo');
  
    // 쿠키에서 정보 가져오기: JSON 파싱이 필요함
    if (status === 'authenticated' && session?.userData && infoCookie) {
      return;
    }
    
    const parsedUserData = JSON.stringify(session.userData);
    Cookies.set('userInfo', parsedUserData);  // 쿠키에 사용자 정보 저장
    setUserInfo(session.userData); // 상태에 사용자 정보 저장
    // console.log(session);
    // console.log(status);
  }, [status]);
  
  useEffect(() => {
    // userInfo 상태가 업데이트될 때마다 쿠키에 저장
    // console.log(userInfo)
    const infoCookie = Cookies.get('userInfo');
    if (userInfo) {
      Cookies.set('userInfo', JSON.stringify(userInfo));
      // console.log('쿠키 등록함~');
      // console.log(infoCookie);
    }
    // console.log(session);
    // console.log(status);
  }, [userInfo]);
  
  useEffect(() => {
    const infoCookie = Cookies.get('userInfo');
    if (infoCookie) {
      // console.log('쿠키에서 사용자 정보 로드');
      // console.log(infoCookie);
      setUserInfo(JSON.parse(infoCookie)); // 쿠키에서 정보를 파싱하여 상태에 설정
    }
    // console.log(Cookies.get('userInfo'));
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
        Cookies.remove('userInfo'); // 로그아웃 시 쿠키 삭제
        router.push('/');
      })
    } else {
      console.error('Failed to update user information in the database');
    }
  } catch (error) {
    console.error('Error during API request:', error);
  }
}
