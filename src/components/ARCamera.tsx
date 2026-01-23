"use client";

import { SwitchCamera, X, Check, RotateCcw, Loader2 } from "lucide-react";
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
  
  // Initialize loading as true so the first render is already "loading"
  const [isLoading, setIsLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);

  const overlays: Record<string, string> = {
    "1": "/frames/frame-1.png",
    "2": "/frames/frame-2.png",
    "3": "/frames/frame-3.png",
  };

  const overlaySrc = overlays[stopId] ?? "/frames/frame-1.png";

  // --- Handlers ---

  const handleToggleCamera = () => {
    // 1. Set loading state HERE, before the render happens
    setIsLoading(true);
    // 2. Trigger the dependency change
    setIsFrontCamera((prev) => !prev);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  // --- Effect ---

  useEffect(() => {
    let isMounted = true;
    
    const initCamera = async () => {
      // Clear previous errors/streams
      setPermissionError(false);
      stopCamera();

      try {
        const constraints = {
          video: {
            facingMode: isFrontCamera ? "user" : "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!isMounted || !videoRef.current) {
          // If component unmounted while waiting, clean up immediately
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;

        // Wait for video to actually be ready to play
        await new Promise<void>((resolve) => {
          if (!videoRef.current) return resolve();
          videoRef.current.onloadedmetadata = () => resolve();
        });

        if (isMounted && videoRef.current) {
          await videoRef.current.play();
          setIsLoading(false); // Only update state when Async work is done
        }
      } catch (err) {
        console.error("Camera error:", err);
        if (isMounted) {
          setPermissionError(true);
          setIsLoading(false);
        }
      }
    };

    initCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isFrontCamera]); // Only re-run when camera angle changes

  const capture = () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !overlayRef.current ||
      !containerRef.current
    )
      return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Smart Crop Logic (same as previous solution)
    const renderWidth = containerRef.current.clientWidth;
    const renderHeight = containerRef.current.clientHeight;
    const renderRatio = renderWidth / renderHeight;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const videoRatio = videoWidth / videoHeight;

    const scaleFactor = 2; 
    canvas.width = renderWidth * scaleFactor;
    canvas.height = renderHeight * scaleFactor;

    let sx, sy, sWidth, sHeight;

    if (videoRatio > renderRatio) {
      sHeight = videoHeight;
      sWidth = videoHeight * renderRatio;
      sx = (videoWidth - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = videoWidth;
      sHeight = videoWidth / renderRatio;
      sx = 0;
      sy = (videoHeight - sHeight) / 2;
    }

    ctx.save();
    if (isFrontCamera) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.drawImage(overlayRef.current, 0, 0, canvas.width, canvas.height);
    setCapturedImage(canvas.toDataURL("image/png", 0.9));
  };

  const handleClose = () => {
    stopCamera();
    onClose(capturedImage);
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black flex flex-col font-sans">
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-end">
        <button onClick={() => onClose(null)} className="text-white p-2">
          <X className="w-8 h-8 drop-shadow-md" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 relative">
        {permissionError && (
          <div className="text-white text-center p-6 bg-neutral-900 rounded-xl">
            <p>Camera access denied.</p>
            <p className="text-sm text-neutral-400 mt-2">Please check your browser settings.</p>
          </div>
        )}

        {!permissionError && (
          <div
            ref={containerRef}
            className="relative w-full max-w-md aspect-[4/3] overflow-hidden bg-black rounded-xl shadow-2xl ring-1 ring-white/10"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm transition-all">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}
            
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                 isLoading ? 'opacity-0' : 'opacity-100'
              } ${isFrontCamera ? "scale-x-[-1]" : ""}`}
              playsInline
              muted
            />

            <img
              ref={overlayRef}
              src={overlaySrc}
              alt="AR Frame"
              className="absolute inset-0 w-full h-full pointer-events-none object-fill z-10"
              crossOrigin="anonymous" 
            />
          </div>
        )}
      </div>

      {!capturedImage && !permissionError && (
        <div className="relative p-8 pb-12 flex justify-center gap-6 bg-gradient-to-t from-black/80 to-transparent">
          <button
            onClick={capture}
            disabled={isLoading}
            className="w-20 h-20 rounded-full bg-white border-4 border-neutral-300 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100"
          />

          <button
            onClick={handleToggleCamera}
            disabled={isLoading}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-3 rounded-full bg-neutral-800/50 text-white backdrop-blur-md border border-white/10 disabled:opacity-50"
          >
            <SwitchCamera className="w-6 h-6" />
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {capturedImage && (
        <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center p-4">
          <img
            src={capturedImage}
            className="max-w-full max-h-[70vh] rounded-lg shadow-lg border border-white/10"
            alt="Captured"
          />

          <div className="flex gap-6 mt-8">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-800 text-white font-medium"
              onClick={() => setCapturedImage(null)}
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </button>
            <button 
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold" 
              onClick={handleClose}
            >
              <Check className="w-4 h-4" />
              Use Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { SwitchCamera } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// interface Props {
//   stopId?: string;
//   onClose: (v: string | null) => void;
// }

// export default function ARCamera({ stopId = "1", onClose }: Props) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const overlayRef = useRef<HTMLImageElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [isFrontCamera, setIsFrontCamera] = useState(false);

//   const overlays: Record<string, string> = {
//     "1": "/frames/frame-1.png",
//     "2": "/frames/frame-2.png",
//     "3": "/frames/frame-3.png",
//   };

//   const overlaySrc = overlays[stopId] ?? "/frames/frame-1.png";

//   const stopCamera = () => {
//     if (videoRef.current?.srcObject) {
//       (videoRef.current.srcObject as MediaStream)
//         .getTracks()
//         .forEach((t) => t.stop());
//       videoRef.current.srcObject = null;
//     }
//   };

//   const startCamera = async () => {
//     stopCamera();

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: isFrontCamera ? "user" : "environment",
//         },
//       });

//       if (!videoRef.current) return;

//       videoRef.current.srcObject = stream;
//       videoRef.current.playsInline = true;
//       videoRef.current.muted = true;

//       await new Promise<void>((resolve) => {
//         videoRef.current!.onloadedmetadata = () => resolve();
//       });

//       await videoRef.current.play();
//     } catch (err) {
//       console.error("Camera error:", err);
//     }
//   };

//   useEffect(() => {
//     startCamera();

//     return () => stopCamera();
//   }, [isFrontCamera]);



//   const capture = () => {
//     if (
//       !videoRef.current ||
//       !canvasRef.current ||
//       !overlayRef.current ||
//       !containerRef.current
//     )
//       return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const width = containerRef.current.clientWidth;
//     const height = containerRef.current.clientHeight;

//     canvas.width = width;
//     canvas.height = height;

//     // Mirror ONLY for front camera
//     if (isFrontCamera) {
//       ctx.save();
//       ctx.translate(width, 0);
//       ctx.scale(-1, 1);
//       ctx.drawImage(videoRef.current, 0, 0, width, height);
//       ctx.restore();
//     } else {
//       ctx.drawImage(videoRef.current, 0, 0, width, height);
//     }

//     // Overlay
//     ctx.drawImage(overlayRef.current, 0, 0, width, height);

//     setCapturedImage(canvas.toDataURL("image/png"));
//   };

//   const handleClose = () => {
//     stopCamera();
//     onClose(capturedImage);
//   };

//   return (
//     <div className="fixed inset-0 z-[999999] bg-black flex flex-col">
//       <div className="flex-1 flex items-center justify-center px-4">
//         <div
//           ref={containerRef}
//           className="relative w-full max-w-md aspect-[4/3] overflow-hidden bg-black"
//         >
//           {/* Camera */}
//           <video
//             ref={videoRef}
//             className={`absolute inset-0 w-full h-full object-cover ${isFrontCamera ? "scale-x-[-1]" : ""
//               }`}

//             playsInline
//             muted
//             autoPlay
//           />

//           {/* Overlay */}
//           <img
//             ref={overlayRef}
//             src={overlaySrc}
//             alt="AR Frame"
//             className="absolute inset-0 w-full h-full pointer-events-none"
//           />
//         </div>
//       </div>

//       {/* Controls */}
//       {!capturedImage && (
//         <div className="relative p-6 flex justify-center gap-6">

//           <button
//             onClick={capture}
//             className="w-20 h-20 rounded-full bg-accent border-4 border-white"
//           />

//           <button
//             onClick={() => setIsFrontCamera((prev) => !prev)}
//             className="absolute right-10 top-1/2 -translate-y-1/2 btn !bg-transparent text-white px-4 py-2 rounded flex items-center gap-2"
//           >
//             <SwitchCamera strokeWidth={1} className="w-8 h-8" />


//           </button>
//         </div>
//       )}

//       {/* Canvas */}
//       <canvas ref={canvasRef} className="hidden" />

//       {/* Preview */}
//       {capturedImage && (
//         <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4">
//           <img
//             src={capturedImage}
//             className="max-w-[90%] max-h-[70%]"
//             alt="Captured"
//           />

//           <div className="flex gap-4">
//             <button
//               className="btn bg-red-500"
//               onClick={() => setCapturedImage(null)}
//             >
//               Retake
//             </button>
//             <button className="btn bg-accent" onClick={handleClose}>
//               Satisfied
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

