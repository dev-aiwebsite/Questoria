"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  stopId?: string;
  oncCaptureImage?: (v:string) => void;
}

export default function ARPostcardPage({oncCaptureImage, stopId = "1" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Map stopId to overlay frame
  const overlays: Record<string, string> = {
    "1": "/frames/frame1.png",
    "2": "/frames/frame2.png",
    "3": "/frames/frame3.png",
  };
  const overlaySrc = overlays[stopId] || "/frames/frame1.png";

  useEffect(() => {
    async function startCamera() {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
      }
    }
    startCamera();
  }, []);

  const capture = () => {
  if (!videoRef.current || !canvasRef.current || !overlayRef.current) return;

  const video = videoRef.current;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Maintain aspect ratio
  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  // Mirror video
  ctx.save();
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, width, height);
  ctx.restore();

  // Draw overlay
  const overlayImg = overlayRef.current;
    ctx.drawImage(overlayImg, 0, 0, width, height);


  // Save snapshot
  const dataUrl = canvas.toDataURL("image/png");
  setCapturedImage(dataUrl);

  if(oncCaptureImage){
    oncCaptureImage(dataUrl)
  }
  // Auto download
  // const link = document.createElement("a");
  // link.href = dataUrl;
  // link.download = `stop-${stopId}-ar-postcard.png`;
//   link.click();
};


  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* Camera feed */}
      <video
        ref={videoRef}
        style={{
          width: "100%",
          height: "100%",
        //   objectFit: "cover",
          transform: "scaleX(-1)", // mirror preview
        }}
      />

      {/* Overlay image */}
      <img
        ref={overlayRef}
        src={overlaySrc}
        alt="AR Frame"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        //   animation: "float 3s ease-in-out infinite alternate",
        }}
      />

      {/* Floating animation keyframes */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>

      {/* Capture button */}
      <button
        onClick={capture}
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "1rem 2rem",
          fontSize: "1rem",
          borderRadius: "8px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
        }}
      >
        Capture
      </button>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Display captured image */}
      {capturedImage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img
            src={capturedImage}
            alt="Captured"
            style={{ maxWidth: "90%", maxHeight: "70%" }}
          />
          <button
            onClick={() => setCapturedImage(null)}
            style={{
              marginTop: 20,
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              borderRadius: "8px",
              backgroundColor: "#ff4081",
              color: "white",
              border: "none",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
