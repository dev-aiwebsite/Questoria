"use client"

import { checkpoints } from "@/lib/dummy";
import Image from "@/components/optimizeImage";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Page() {
      const pathname = usePathname();
    const { checkpointId } = useParams<{ checkpointId: string }>();
    const checkpointData = checkpoints.find(c => c.id == checkpointId)

    return (
        <div className="p-mobile">
            {!checkpointData ?
                <>Data not found.</>
                :
                <div className="space-y-6">
                    <h3 
                      className={`text-center header3 !mb-6 ${checkpointId === 'cp_013' ? 'text-sm' : ''}`}
                    >
                      {checkpointData.subtitle}
                    </h3>
                    <Image
                        className="border-black border-3 rounded-xl w-full"
                        src={checkpointData.image}
                        width={200}
                        height={200}
                        alt={checkpointData.title}
                    />
                    <div>
                        <div
                            className="text-sm space-y-6"
                            dangerouslySetInnerHTML={{ __html: checkpointData.did_you_know }}
                        />
                    </div>
                    <Link href={`${pathname}/challenges`} className="btn primary w-full">Clear this checkpoint</Link>
                </div>
            }
        </div>
    );
}