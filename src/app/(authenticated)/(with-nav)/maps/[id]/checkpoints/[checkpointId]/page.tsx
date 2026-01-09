"use client"

import { useParams } from "next/navigation";

export default function Page() {
  const { checkpointId } = useParams<{ checkpointId: string }>();
  

    return (
        <div>
            Stop: {checkpointId}
        </div>
    );
}