"use client";

import { SwitchCamera } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  stopId?: string;
  onClose: (v: string | null) => void;
}

export default function ARCamera({ stopId = "1", onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  const overlays: Record<string, string> = {
    "1": "/frames/frame-1.png",
    "2": "/frames/frame-2.png",
    "3": "/frames/frame-3.png",
  };

  const overlaySrc = overlays[stopId] ?? "/frames/frame-1.png";

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
        },
      });

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;
      videoRef.current.playsInline = true;
      videoRef.current.muted = true;

      await new Promise<void>((resolve) => {
        videoRef.current!.onloadedmetadata = () => resolve();
      });

      await videoRef.current.play();
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  useEffect(() => {
    startCamera();

    return () => stopCamera();
  }, [isFrontCamera]);

  const capture = () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !overlayRef.current ||
      !containerRef.current
    )
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    canvas.width = width;
    canvas.height = height;

    // Mirror ONLY for front camera
    if (isFrontCamera) {
      ctx.save();
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      ctx.restore();
    } else {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
    }

    // Overlay
    ctx.drawImage(overlayRef.current, 0, 0, width, height);

    setCapturedImage(canvas.toDataURL("image/png"));
  };

  const handleClose = () => {
    stopCamera();
    onClose(capturedImage);
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div
          ref={containerRef}
          className="relative w-full max-w-md aspect-[4/3] overflow-hidden bg-black"
        >
          {/* Camera */}
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover ${
  isFrontCamera ? "scale-x-[-1]" : ""
}`}

            playsInline
            muted
            autoPlay
          />

          {/* Overlay */}
          <img
            ref={overlayRef}
            src={overlaySrc}
            alt="AR Frame"
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>
      </div>

      {/* Controls */}
      {!capturedImage && (
        <div className="relative p-6 flex justify-center gap-6">

          <button
            onClick={capture}
            className="w-20 h-20 rounded-full bg-accent border-4 border-white"
          />

           <button
            onClick={() => setIsFrontCamera((prev) => !prev)}
            className="absolute right-10 top-1/2 -translate-y-1/2 btn !bg-transparent text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <SwitchCamera  strokeWidth={1} className="w-8 h-8" />

            
          </button>
        </div>
      )}

      {/* Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Preview */}
      {capturedImage && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4">
          <img
            src={capturedImage}
            className="max-w-[90%] max-h-[70%]"
            alt="Captured"
          />

          <div className="flex gap-4">
            <button
              className="btn bg-red-500"
              onClick={() => setCapturedImage(null)}
            >
              Retake
            </button>
            <button className="btn bg-accent" onClick={handleClose}>
              Satisfied
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
