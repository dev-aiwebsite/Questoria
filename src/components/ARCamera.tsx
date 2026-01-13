"use client";

import { div } from "framer-motion/client";
import { useEffect, useRef, useState } from "react";

interface Props {
  stopId?: string;
  oncCaptureImage?: (v: string) => void;
  onClose: (v: string | null) => void;
}

export default function ARCamera({ stopId = "1", onClose }: Props) {
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
  // const overlaySrc = overlays[stopId] || "/frames/frame1.png";
  const overlaySrc ="/images/mascott1.png";

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!mounted || !videoRef.current) return;

        videoRef.current.srcObject = stream;

        // Wait for metadata to load before playing
        await new Promise<void>((resolve) => {
          videoRef.current!.onloadedmetadata = () => resolve();
        });

        await videoRef.current.play();
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.warn("Camera play() was interrupted, retrying...");
          setTimeout(() => startCamera(), 500);
        } else {
          console.error("Camera access denied or unavailable", err);
        }
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
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
    ctx.drawImage(overlayImg, -120, height - 300, 270, 300);


    // Save snapshot
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);

    // Auto download
    // const link = document.createElement("a");
    // link.href = dataUrl;
    // link.download = `stop-${stopId}-ar-postcard.png`;
    //   link.click();
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose?.(capturedImage);
  };


  return (
    <div className="flex flex-col flex-nowrap gap-0 h-screen w-screen absolute z-[999999] bg-black">
      <div className="h-[200px]">
      </div>
      <div
        className="relative w-full h-fit aspect-4/3 my-0 mx-auto overflow-hidden bg-white"
      >
        {/* Camera feed */}
        <video
          className="w-full h-full object-cover scale-x-[-1]"
          ref={videoRef}
        />

        {/* Overlay image */}
        <img
          className="absolute w-[190px] h-[200px] bottom-0 -left-20 pointer-events-none"
          ref={overlayRef}
          src={overlaySrc}
          alt="AR Frame"
        />
      </div>

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

      <div
        className="flex mt-auto p-mobile gap-2 flex-row flex-nowrap items-center justify-center">
        {/* Capture button only if no image is captured */}
        {!capturedImage && (
          <button
            onClick={capture}
            className="rounded-full bg-accent aspect-square w-20 h-20 border-5 border-gray-600"
          >

          </button>
        )}

      </div>


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
          <div className="p-2 grid grid-cols-2 gap-2 items-center justify-center">
            {/* Retake button only if there is a captured image */}
            {capturedImage && (
              <button
              className="btn !bg-red-400"
                onClick={() => setCapturedImage(null)}
              >
                Retake
              </button>
            )}

            {/* Satisfied button only if there is a captured image */}
            {capturedImage && (
              <button
              className="btn !bg-accent"
                onClick={() => {
                  handleClose(); // stop camera & close overlay
                }}
                
              >
                Satisfied
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
