"use client"

import { useEffect, useState } from "react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { useShareContext } from "@/context/ShareContext";
import { signOut } from "next-auth/react";

export default function Join() {

    const { session, status, router } = useShareContext();

    const [user, setUser] = useState({
        email:'',
        password:'',
        nickname:'',
    });
    const [condition, setCondition] = useState({
        terms: false,
        email: false,
        password: false,
        pwdChk:false,
        nickname:false,
    });
    const [visibility, setVisibility] = useState({
        password: false,
        pwdChk: false,
    });

    useEffect(() => {
        if (status === "authenticated") {
            setUser((prevUser)=>({
                ...prevUser,
                nickname:session?.user?.name,
            }));
            setCondition((prevCondition)=>({
                ...prevCondition,
                password: true,
                pwdChk: true,
            }));
        }
    }, [status]);

    useEffect(() => {
        console.log(condition);
    }, [condition]);

    useEffect(() => {
        console.log(user);
    }, [user]);

    useEffect(() => {
        console.log(visibility)
    }, [visibility])

    const terms = ' 대충 조항입니다. 대충 조항입니다... (생략) ... 대충 조항입니다.';

    const checkTermsHandler = (e) => {
        setCondition((prevCondition) => ({
            ...prevCondition,
            terms: !condition.terms
        }))
    }
    const checkIdHandler = (e) => {
        if(!e.target.value) {
            setCondition((prevCondition) => ({
                ...prevCondition,
                nickname: false
            }));
        }
    };

    const checkPwdHandler = (e) => {
        if( e.target.value.length >= 8 ) {
            setCondition((prevCondition) => ({
                ...prevCondition,
                password: true
            }));
            setUser(prevUser => ({
                ...prevUser,
                password: e.target.value
            }))
        } else {
            setCondition((prevCondition) => ({
                ...prevCondition,
                password: false
            }));
            setUser(prevUser => ({
                ...prevUser,
                password: ''
            }))
        }
    };

    const checkPwdChkHandler = (e) => {
        e.target.value === user.password 
        && setCondition((prevCondition => ({
            ...prevCondition,
            pwdChk: true
        })))
    }

    const toggleVisibility = (field) => {
        setVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    const checkDupIdHandler = async () => {

        const id = document.getElementById('id').value;
        if (id) {
            // const savedInfo = JSON.parse(localStorage.getItem('users')) || [];
            // const isDuplicate = savedInfo.some(info => info.id === id);
            try {

                const response = await fetch('/api/dup-id',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({id})
                })

                const data = await response.json();

                if (data.dupStatus) {
                    alert('중복된 닉네임이 존재합니다. 다른 닉네임을 사용해주세요.');
                } else {
                    alert('사용 가능한 닉네임입니다.');
                    document.getElementById('id').readOnly = true;
                    setCondition(prevCondition=>({
                        ...prevCondition,
                        nickname : true
                    }));
                    setUser(prevUser=>({
                        ...prevUser,
                        nickname : id
                    }));
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            alert('닉네임을 입력하세요.');
        }
    };

    const checkDupEmailHandler = async () => {
        const email = document.getElementById('email').value;
        if (email) {
            // const savedInfo = JSON.parse(localStorage.getItem('users')) || [];
            // const isDuplicate = savedInfo.some(user => user.email === email);
            try{
                
                const response = await fetch('/api/dup-email',{
                    method:'POSt',
                    headers:{'Content-Type':'appication/json'},
                    body:JSON.stringify({email})
                })

                const data = await response.json();
                
                if (data.dupStatus) {
                    alert('중복된 이메일이 존재합니다. 다른 이메일을 사용해주세요.');
                } else {
                    setCondition((prevCondition) => ({
                        ...prevCondition,
                        email: true,
                    }));
                    setUser((prevUser) => ({
                        ...prevUser,
                        email: email,
                    }));
                    alert('사용 가능한 이메일입니다.');
                    document.getElementById('email').readOnly = true;
                }
            } catch (e) {

            }
        } else {
            alert('이메일을 입력하세요.');
        }
    };

    const checkJoinable = async () => {
        const isJoinable = Object.values(condition).every(Boolean);
        if(isJoinable) {
            try {
                const response = await fetch('/api/join',{
                        method: 'POST',
                        headers: {'Content-Type':'application/json'},
                        body: JSON.stringify({user, session})
                })
                if (response.ok) {
                    // 회원가입 성공 후의 처리 로직
                    alert('회원가입이 완료되었습니다!');
                    signOut({ redirect:false }).then(() => {
                        router.push('/');
                    });
                } else {
                    alert('데이터 송신에 문제가 있습니다.\n관리자에게 문의해주세요.');
                }
            } catch(e) {
                console.error('Error during registration:', e);
                alert(e);
            }
        } else {
            alert('입력된 정보를 다시 확인해주세요.');
        }
    }

    return (
        <div className="join">
            <div className="terms">
                <h4>회원가입</h4>
                <textarea value={terms} readOnly />
                <div>
                    <input type="checkbox" id="terms-agree" onChange={checkTermsHandler}/>
                    <label htmlFor="terms-agree">동의합니다.</label>
                </div>
            </div>
            <div className="join-userinfo">
                
                <div>
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" placeholder="이메일을 입력하세요" />
                    <button onClick={checkDupEmailHandler}>중복확인</button>
                </div>
                <div>
                    <label htmlFor="id">닉네임</label>
                    <input type="text" id="id" onChange={checkIdHandler} defaultValue={user.nickname} placeholder="닉네임을 입력하세요" />
                    <button onClick={checkDupIdHandler}>중복확인</button>
                </div>
                {status !== 'authenticated' && (<>
                    <div>
                        <label htmlFor="pwd">비밀번호</label>
                        <input type={visibility.password ? 'text' : 'password'} id="pwd" onChange={checkPwdHandler} placeholder="비밀번호를 입력하세요" />
                        <button onClick={() => toggleVisibility('password')} tabIndex="-1" aria-label="Toggle password visibility">{visibility.password ? <IoEyeOffSharp /> : <IoEyeSharp />}</button>
                    </div>
                    <div>
                        <label htmlFor="pwdChk">비밀번호 확인</label>
                        <input type={visibility.pwdChk ? 'text' : 'password'} id="pwdChk" onChange={checkPwdChkHandler} placeholder="비밀번호를 다시 입력하세요" />
                        <button onClick={() => toggleVisibility('pwdChk')} tabIndex="-1" aria-label="Toggle password confirmation visibility">{visibility.pwdChk ? <IoEyeOffSharp /> : <IoEyeSharp />}</button>
                    </div></>
                )}
                
                <button onClick={checkJoinable}>회원가입</button>
            </div>
        </div>
    );
}
