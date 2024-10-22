"use client";

import "../globals.css";
import { useShareContext } from "@/context/ShareContext";
import { useEffect } from "react";

export default function ComunityLayout({ children }) {

    const { comunityCategoryNum, setComunityCategoryNum } = useShareContext();

  // 클라이언트에서만 로컬 스토리지 접근
  useEffect(() => {
    const storedSelection = parseInt(localStorage.getItem('comunityCategoryNum'));
    // 로컬 스토리지에 값이 있을 경우에만 설정, 없을 경우 0으로 초기화
    if (!isNaN(storedSelection)) {
        setComunityCategoryNum(storedSelection);
    } else {
        setComunityCategoryNum(0);
    }
  }, []);

  useEffect(() => {
    if (comunityCategoryNum !== null) {
      localStorage.setItem('comunityCategoryNum', comunityCategoryNum);
    }
  }, [comunityCategoryNum]);

  return (
    <div>
        <ComuNav comunityCategoryNum={comunityCategoryNum} setComunityCategoryNum={setComunityCategoryNum}/>
        {children}
    </div>
  );
}

function comunityCategoryHandler(setComunityCategoryNum,num) {
    setComunityCategoryNum(num);
    scrollTo({top:0})
}

function ComuNav({ comunityCategoryNum, setComunityCategoryNum }) {

    return(
        <>
            <div className="info-category">
                <div onClick={()=> comunityCategoryHandler(setComunityCategoryNum,0)}>
                    <p style={comunityCategoryNum == 0 ? { color: "cornflowerblue" } : { color: "black" }}>전체</p>
                </div>
                <div onClick={()=> comunityCategoryHandler(setComunityCategoryNum,1)}>
                    <p style={comunityCategoryNum == 1 ? { color: "cornflowerblue" } : { color: "black" }}>리뷰</p>
                </div>
                <div onClick={()=> comunityCategoryHandler(setComunityCategoryNum,2)}>
                    <p style={comunityCategoryNum == 2 ? { color: "cornflowerblue" } : { color: "black" }}>자유게시판</p>
                </div>
            </div>
        </>
    )
}