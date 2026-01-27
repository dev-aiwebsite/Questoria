import Image from "next/image";

export default function PageLoader() {
  return (
    <div className="fixed top-0 left-0 bg-white h-screen w-screen flex items-center justify-center z-[9999999999999]">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex items-center justify-center aspect-square w-[120px] h-auto rounded-full border-black border-2 bg-primary">
          <div className="border-4 border-white w-full h-full rounded-full items-center justify-center flex relative">
            <span className="block absolute top-3.5 left-3.5 w-4.5 h-6.5 bg-white/40 rounded-[10px/60%] rotate-[32deg]"></span>

            {/* Compass Search Animation */}
            <div className="compass-search">
              <Image
                width={60}
                height={60}
                alt="compass"
                src="/images/IconCompass.png"
              />
            </div>
          </div>
        </div>

        {/* Loading Text + Animated Dot */}
        <div className="text-xl font-bold text-black flex items-center gap-2">
          Loading
          <span className="loading-dot">.</span>
          <span className="loading-dot delay-1">.</span>
          <span className="loading-dot delay-2">.</span>
        </div>
      </div>
    </div>
  );
}
