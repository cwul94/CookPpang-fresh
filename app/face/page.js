// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function FaceDetection() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [streaming, setStreaming] = useState(false);

//   useEffect(() => {
//     async function setupCamera() {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//       });
//       videoRef.current.srcObject = stream;
//       videoRef.current.play();
//       setStreaming(true);
//     }

//     if (!streaming) {
//       setupCamera();
//     }
//   }, [streaming]);

//   useEffect(() => {
//     const loadOpenCV = async () => {
//       // 이미 OpenCV.js가 로드되었는지 확인
//       if (window.cv) {
//         console.log("OpenCV.js is already loaded.");
//         return;
//       }

//       const script = document.createElement("script");
//       script.src = "https://docs.opencv.org/4.5.0/opencv.js"; // OpenCV.js 버전 확인
//       script.async = true;
//       document.body.appendChild(script);
  
//       script.onload = async () => {
//         if (window.cv && window.cv.CascadeClassifier) {
//           const video = videoRef.current;
//           const canvas = canvasRef.current;
//           const ctx = canvas.getContext("2d");
  
//           const cap = new window.cv.VideoCapture(video);
//           const faceCascade = new window.cv.CascadeClassifier();

//           // XML 파일 경로 확인
//           const success = faceCascade.load("/haarcascade_frontalface_default.xml");
//           if (!success) {
//             console.error("Failed to load XML file");
//             return;
//           }

//           const detectFace = () => {
//             const frame = new window.cv.Mat(video.height, video.width, window.cv.CV_8UC4);
//             cap.read(frame);
  
//             const grayFrame = new window.cv.Mat();
//             window.cv.cvtColor(frame, grayFrame, window.cv.COLOR_RGBA2GRAY);
  
//             const faces = new window.cv.RectVector();
//             const msize = new window.cv.Size(0, 0);
//             faceCascade.detectMultiScale(grayFrame, faces, 1.1, 3, 0, msize, msize);
  
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // 비디오 프레임을 캔버스에 그리기
//             for (let i = 0; i < faces.size(); i++) {
//               const face = faces.get(i);
//               ctx.strokeStyle = "red";
//               ctx.lineWidth = 2;
//               ctx.strokeRect(face.x, face.y, face.width, face.height);
//             }
  
//             frame.delete();
//             grayFrame.delete();
//             faces.delete();
//           };
  
//           const interval = setInterval(detectFace, 100);
//           return () => clearInterval(interval);
//         } else {
//           console.error("OpenCV.js is not loaded or CascadeClassifier is not available.");
//         }
//       };
//     };
  
//     loadOpenCV();
//   }, []); // dependencies 배열을 비워서 컴포넌트가 마운트될 때만 실행되도록 함
  
//   return (
//     <div>
//       <h1>Real-Time Face Detection</h1>
//       <video ref={videoRef} width="640" height="480" style={{ display: streaming ? "block" : "none" }}></video>
//       <canvas ref={canvasRef} width="640" height="480"></canvas>
//     </div>
//   );
// }
