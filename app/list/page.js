"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useShareContext } from "@/context/ShareContext";
import { BsFillCartCheckFill } from "react-icons/bs";

export default function List() {

    const { userInfo, setUserInfo, listCategoryNum, setMainCategoryNum, status, router } = useShareContext();
    const modalRef = useRef(null);
    const yesButtonRef = useRef(null);
    const [ isModal, setIsModal ] = useState(false);
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ 상품, set상품 ] = useState([
        { id: 1, name: 'Tomatoes 1', category:'vegitable', price: 4.4, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food0.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 2, name: 'Pasta 1', category:'foodstuffs', price: 2.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food1.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 3, name: 'Coconut 1', category:'fruit', price: 4.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food2.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 4, name: 'Tomatoes 2', category:'vegitable', price: 4.4, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food0.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 5, name: 'Pasta 2', category:'foodstuffs', price: 2.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food1.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 6, name: 'Coconut 2', category:'fruit', price: 4.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food2.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 7, name: 'Tomatoes 3', category:'vegitable', price: 4.4, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food0.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 8, name: 'Pasta 3', category:'foodstuffs', price: 2.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food1.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 9, name: 'Coconut 3', category:'fruit', price: 4.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food2.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 10, name: 'Tomatoes 4', category:'vegitable', price: 4.4, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food0.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 11, name: 'Pasta 4', category:'foodstuffs', price: 2.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food1.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 12, name: 'Coconut 4', category:'fruit', price: 4.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food2.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 13, name: 'Tomatoes 5', category:'vegitable', price: 4.4, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food0.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 14, name: 'Pasta 5', category:'foodstuffs', price: 2.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food1.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 15, name: 'Coconut 5', category:'fruit', price: 4.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food2.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 16, name: 'Tomatoes 6', category:'vegitable', price: 4.4, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food0.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 17, name: 'Pasta 6', category:'foodstuffs', price: 2.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food1.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 18, name: 'Coconut 6', category:'fruit', price: 4.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food2.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 19, name: 'Tomatoes 7', category:'vegitable', price: 4.4, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food0.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 20, name: 'Pasta 7', category:'foodstuffs', price: 2.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food1.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 21, name: 'Coconut 7', category:'fruit', price: 4.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food2.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 22, name: 'Tomatoes 8', category:'vegitable', price: 4.4, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food0.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 23, name: 'Pasta 8', category:'foodstuffs', price: 2.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food1.png', isActive: false, isCarted: false, isChecked: true, },
        { id: 24, name: 'Coconut 8', category:'fruit', price: 4.0, quantity: 1, img: 'https://codingapple-cdn.b-cdn.net/wp-content/uploads/2023/01/food2.png', isActive: false, isCarted: false, isChecked: true, },
    ]);

    // userInfo가 바뀔 때마다 상품의 isActive 상태를 업데이트
    useEffect(() => {
        if (userInfo) {
            set상품((prevItems) =>
                prevItems.map((item) => ({
                    ...item,
                    isActive: userInfo?.jjim?.some(jjimItems => jjimItems.intrst_name === item.name),
                    isCarted: userInfo?.cart?.some(cartItems => cartItems.cart_name === item.name),
                }))
            );
        }
    }, [userInfo]);

    useEffect(() => {
        if (isModal) {
            yesButtonRef.current?.focus();
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isModal])

    const putCartHandler = (product,quantity) => {

        if (status !== 'authenticated') {
            alert('로그인이 필요합니다.');
            setMainCategoryNum(0);
            router.push('/');
            return;
        }
        if (userInfo) {
            const isExisting = userInfo?.cart.find(item => item.cart_name === product.name);
            if (isExisting) {
                setMessage('이미 장바구니에 있어요~');
            } else {
                const updatedProduct = { 
                    cart_name: product.name,
                    cart_price: product.price,
                    cart_quantity: quantity,
                    cart_category: product.category,
                    cart_img: product.img,
                    cart_isChked: product.isChecked,
                }; // 선택한 수량으로 업데이트된 상품
                const updatedCart = [...userInfo?.cart, updatedProduct];
                const updatedUserInfo = {
                    ...userInfo,
                    cart: updatedCart,
                };
                setUserInfo(updatedUserInfo);
                setMessage('선택한 상품이 장바구니에 담겼어요!');
            }
            setIsModal(!isModal);
            setIsModalVisible(!isModalVisible);
            setTimeout(() => {
                setIsModal(false); // n초 후에 모달 사라짐
                setTimeout(() => {
                    setIsModalVisible(false); // 상태를 false로 바꿔서 모달을 완전히 숨김
                }, 500); // 애니메이션 시간과 맞추기
            }, 700);
        }
    };

    const putJjimHandler = (product) => {

        if (status !== 'authenticated') {
            alert('로그인이 필요합니다.');
            setMainCategoryNum(0);
            router.push('/');
            return;
        }
        
        const updated상품 = 상품.map(item =>
            item.name === product.name
                ? { ...item, isActive: !item.isActive }
                : item
        );
        set상품(updated상품);

        let updatedUserInfo;
        const isExisting = userInfo?.jjim.find(item => item.intrst_name === product.name);
        if (isExisting) {
            const updatedJjim = userInfo?.jjim.filter(item => item.intrst_name !== product.name);
            updatedUserInfo = {
                ...userInfo,
                jjim: updatedJjim,
            };
            setMessage('찜 목록에서 삭제되었습니다.');
        } else {
            const updatedProduct = {
                intrst_name: product.name,
                intrst_category: product.category,
                intrst_price: product.price,
                intrst_img: product.img,
            };
            
            // 업데이트된 jjim 배열 생성
            const updatedJjim = [...userInfo?.jjim, updatedProduct];
            
            // 업데이트된 사용자 정보 객체 생성
            updatedUserInfo = {
                ...userInfo,
                jjim: updatedJjim,
            };
            setMessage('찜 목록에 추가되었습니다!');
        }
        setUserInfo(updatedUserInfo);
        setIsModal(!isModal);
        setIsModalVisible(!isModalVisible);
        setTimeout(() => {
            setIsModal(false); // n초 후에 모달 사라짐
            setTimeout(() => {
                setIsModalVisible(false); // 상태를 false로 바꿔서 모달을 완전히 숨김
            }, 500); // 애니메이션 시간과 맞추기
        },700);
    };
    
    const filteredProducts = 상품.filter(item => {
        if (listCategoryNum === 0) return true; // 모든 상품
        if (listCategoryNum === 1) return item.category === 'foodstuffs'; // foodstuffs
        if (listCategoryNum === 2) return item.category === 'fruit'; // vegitable
        if (listCategoryNum === 3) return item.category === 'vegitable'; // fruit
        return true;
    });

    const gotoCartHandler = () => {
        setMainCategoryNum(2);
        router.push('/cart');
    }

    const keyPressHandler = (event) => {
        if (event.key === "Enter" || event.key === "Escape") {
            event.preventDefault(); // 기본 동작 방지
            setIsModal(!isModal);
            setIsModalVisible(!isModalVisible);
        }
    };
    

    const handleClickOutside = (event) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target)
        ) {
            setIsModal(!isModal);
            setIsModalVisible(!isModalVisible);
        }
    };

    return (
        <div className="list">
            <h3 className="title">상품 목록</h3>
            <div className="product-list">
                { filteredProducts.map((product, i) => (
                    <div className="food" key={i}>
                        <div className="saved-status">
                            <div className="heartCheckbox">
                                <input
                                    type="checkbox"
                                    id={`heart-${i}`}
                                    className="checkbox"
                                    onChange={() => putJjimHandler(product)}
                                    checked={product.isActive}
                                    />
                                <label htmlFor={`heart-${i}`} className="heart"></label>
                            </div>
                            {   
                                product.isCarted && <BsFillCartCheckFill onClick={gotoCartHandler} style={{cursor:"pointer"}} color="cornflowerblue" size='22px'/>
                            }
                        </div>
                        <Image
                            className="product-img"
                            src={product.img}
                            width={500}
                            height={400}
                            alt={product.name}
                            priority
                        />
                        <div className="product-info">
                            <h4>{product.name}</h4>
                            <h4>${product.price}</h4>
                        </div>
                        <div className="put-btn">
                            <p>수량</p>
                            <input
                                type="number"
                                id={`quantity${i}`}
                                min="1"
                                max="99"
                                defaultValue="1"
                            />
                            <button onClick={() => {
                                const quantity = parseInt(document.getElementById(`quantity${i}`).value, 10);
                                putCartHandler(product, quantity);
                            }}>담기</button>
                        </div>
                    
                    </div>
                ))}
            </div>

            {isModalVisible && (
              <div className={`modal ${isModal ? 'show' : ''}`} onKeyPress={keyPressHandler}>
                  <div className="modal-content" ref={modalRef}>
                      <h4>{message}</h4>
                      <button ref={yesButtonRef} onClick={()=>setIsModal(false)}>확인</button>
                  </div>
              </div>
            )}
        </div>
    );
}
