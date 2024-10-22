"use client"

import { useShareContext } from "@/context/ShareContext";

export default function Comunity() {

    const { status, router } = useShareContext();

    useEffect(() => {
        if (status === "loading") {
          // 세션 정보가 로딩 중일 때
          return;
        }
    
        if (status === "unauthenticated") {
          // 인증되지 않은 경우 리다이렉트
          router.push("/");
        }
      }, [status, router]);

    return(
        <div>
            
        </div>
    )
}