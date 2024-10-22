"use client";

import "../globals.css";
import { useShareContext } from "@/context/ShareContext";

export default function InfoLayout({ children }) {


  // 클라이언트에서만 로컬 스토리지 접근
//   useEffect(() => {
//     const storedSelection = parseInt(localStorage.getItem('infoCategoryNum'));
//     // 로컬 스토리지에 값이 있을 경우에만 설정, 없을 경우 0으로 초기화
//     if (!isNaN(storedSelection)) {
//         setInfoCategoryNum(storedSelection);
//     } else {
//         setInfoCategoryNum(0);
//     }
//   }, []);

//   useEffect(() => {
//     if (infoCategoryNum !== null) {
//       localStorage.setItem('infoCategoryNum', infoCategoryNum);
//     }
//   }, [infoCategoryNum]);

  return (
    <div>
        <InfoNav />
        {children}
    </div>
  );
}

async function infoCategoryHandler(setInfoCategoryNum,num) {
    setInfoCategoryNum(num);
    scrollTo({top:0})
}

function InfoNav() {

    const { userInfo, infoCategoryNum, setInfoCategoryNum, session, status } = useShareContext();


    return(
        <>
            <div className="info-category">
                <div onClick={()=> infoCategoryHandler(setInfoCategoryNum,0)}>
                    <p style={infoCategoryNum == 0 ? { color: "cornflowerblue" } : { color: "black" }}>주문목록</p>
                </div>
                <div onClick={()=> infoCategoryHandler(setInfoCategoryNum,1)}>
                    <p style={infoCategoryNum == 1 ? { color: "cornflowerblue" } : { color: "black" }}>회원정보</p>
                </div>
                { userInfo?.userInfo?.password !== null && userInfo?.userInfo?.password !== '' &&
                    <div onClick={()=> infoCategoryHandler(setInfoCategoryNum,2)}>
                        <p style={infoCategoryNum == 2 ? { color: "cornflowerblue" } : { color: "black" }}>비밀번호 변경</p>
                    </div>
                }
            </div>
        </>
    )
}