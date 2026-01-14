"use client";

import { Checkpoint, checkpoints, currentUserId, user_checkpoints } from "@/lib/dummy";
import { ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { id:mapId } = useParams<{ id: string }>();
  
  const [mapWidth, setMapWidth] = useState(1000)
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(0)
  const [checkpointDialogOpen, setCheckpointDialogOpen] = useState(false)
  
  const zoomIn = () => setMapWidth((prev) => Math.min(prev + (prev * 0.5), 3500));
  const zoomOut = () => setMapWidth((prev) => Math.max(prev - (prev * 0.5), 380));
  const currentUserCheckpoints = user_checkpoints.filter(c => c.user_id === currentUserId)


  const mascot = {
    idle: "/images/mascot1.png",
    walking: "/images/mascot1.png",
    flying: "/images/mascot1.png"

  };

  const mascotPos = selectedCheckpoint ? checkpoints[selectedCheckpoint].pos : checkpoints[0].pos

  return (<>
   {checkpointDialogOpen && selectedCheckpoint != null &&
        <CheckpointDialog mapId={mapId} onClose={()=> setCheckpointDialogOpen(false) } checkpointData={checkpoints[selectedCheckpoint]} />
      }
    <div className="relative">
     
      <div className="block border-3 border-black w-screen overflow-auto height-no-header-nav flex">
        <div className="w-fit h-fit relative">
          <Image
            className="pointer-events-none transition-all duration-200 max-w-[unset] aspect-[5/6] h-auto"
            width={mapWidth}
            height={1000}
            src="https://ucarecdn.com/8d9dea7b-e862-40dd-848b-260939817a62/01a73c8ba8186dbeabaf51fdab3c61e72c91a0af1.png"
            alt="Victoria Botanical Garden"
          />

          {checkpoints.length > 0 &&
            checkpoints.map((c,index) => {
               const userCheckPointChallengesData = currentUserCheckpoints.find(uc => uc.checkpoint_id === c.id)?.challenges
               const finishedChallenges = userCheckPointChallengesData?.filter(c => c.value)
              return <div
                key={c.id}
                onClick={()=>{
                  setSelectedCheckpoint(index)
                  setCheckpointDialogOpen(true)
                }}
                className="isolate w-[calc(40px+1.5%)] aspect-square absolute cursor-pointer -translate-x-1/2 -translate-y-full"
                style={{ left: c.pos.x + "%", top: c.pos.y + "%" }}
              >
                {!c.is_visited &&  <Image
                  className="w-[22%] h-auto aspect-square absolute left-[48%] top-[28%]"
                  src="/images/IconLock.png"
                  width={100}
                  height={100}
                  alt="lock"
                />
                }
                {c.is_visited && finishedChallenges?.length && <div className="h-[22%] grid grid-cols-3 absolute left-[48%] top-[60%]">
                  {finishedChallenges.map(uc => {
                    return  <Image
                    key={c.id + uc.value}
                  className="w-auto h-full aspect-square "
                  src="/images/IconStar.png"
                  width={100}
                  height={100}
                  alt="lock"
                />
                  }) }
                 
                </div>

                }
                <Image
                  className="w-full h-full"
                  src="/images/IconFlag.png"
                  width={100}
                  height={100}
                  alt={c.title}
                />
              </div>
            })}

          <div

            className="w-[calc(40px+0.6%)] aspect-square absolute pointer-events-none -translate-x-full -translate-y-1/4"
            style={{ left: mascotPos.x + "%", top: mascotPos.y + "%" }}
          >
            <Image
              className="w-full h-full"
              src={mascot.idle}
              width={40}
              height={40}
              alt="Mascot"

            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 p-2 flex flex-col gap-4 mt-4">
        <button
          className="px-4 py-2 bg-black/80 rounded hover:bg-accent/80 transition"
          onClick={zoomIn}
        >
          <ZoomIn color="white" strokeWidth={2} size={30} />
        </button>
        <button
          className="px-4 py-2 bg-black/80 rounded hover:bg-accent/80 transition"
          onClick={zoomOut}
        >
          <ZoomOut color="white" strokeWidth={2} size={30} />
        </button>

      </div>
    </div>
      </>
  );
}


function CheckpointDialog({mapId, checkpointData, onClose }: {mapId:string; checkpointData: Checkpoint; onClose?: ()=> void; }) {

  return <div className="flex p-mobile w-screen h-screen backdrop-blur-[2px] bg-black/10 absolute z-[999999] top-0 p-10 pt-30 left-0">
      <div className="w-100 mx-auto">
        <p className="whitespace-nowrap font-bold border-3 border-black bg-yellow-400 rounded-xl py-4 w-full text-center text-2xl">{checkpointData.subtitle}</p>
        <div className="px-3">
          <div className="ribbon-end bg-white px-10 pt-6 pb-14">
            <p className="text-sm mb-5" dangerouslySetInnerHTML={{ __html: checkpointData.description }}></p>
            <Link
              className="block mx-auto py-1.5 px-4 w-25 text-center rounded-lg bg-app-blue-600 text-white"
              href={`/maps/${mapId}/checkpoints/${checkpointData.id}`}
            >Enter
            </Link>
            <button
            onClick={() => {
              if(onClose){
                onClose()
              }
            }}
            className="underline text-sm mx-auto block p-4">Back</button>
          </div>
        </div>
      </div>
    
  </div>
}