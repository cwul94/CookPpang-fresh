# NEXT.JS 연습 프로젝트 - 웹 마켓 서비스
![Preview](https://github.com/user-attachments/assets/be165287-9bf1-4626-9f0d-90d3e1a21956)

## 소셜로그인 & 일반로그인 및 회원가입
a. 카카오/네이버/구글/일반  
b. 로그인 세션 만료 시간 - 3h  
c. 회원가입 시 유효성 검사 (인젝션공격 방지)  
d. 소셜로그인 시 인증토큰 만료 기간은 각 플랫폼 내부 정책에 따름  

## 카카오 지도 API 활용한 주소 저장  
a. 물품 전달 및 배송 차원에서 요류를 줄이기 위해 유효한 주소를 얻기 위함  
b. 친근한 UI를 활용하여 UX 향상  
c. 주소라는 정보는 보통 정적이므로, 프리셋 기능을 추가해 클릭 한번으로 원하는 주소로 설정할 수 있도록 디벨롭 예정  

## 장바구니담기 & 찜하기  
a. 위 서비스 이용 중 서버에 저장하는 요청을 하면 UX에 악영향을 끼칠 수 있음  
b. a 문제를 해결하기 위해, 로컬스토리지 & React hooks 응용하여 UX 향상과 서버 요청 트래픽 최적화  

## 주문하기
a. 장바구니에 있는 물품 중 원하는 물품만을 주문할 수 있어야한다  
b. 주소를 설정하지 않으면 주문할 수 없다  
c. 물품이 없거나 선택한 물품이 없으면 주문할 수 없다  
d. 결제 API 미구현  

## 내 정보 조회 & 변경
a. 아이디(별명)/이메일 조회  
b. 아이디/비밀번호 변경  
c. 비밀번호가 없는 소셜로그인의 경우 비밀번호 변경에 대한 카테고리 숨김  
