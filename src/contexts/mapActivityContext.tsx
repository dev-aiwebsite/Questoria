"use client";

import { createUserMap, updateUserMap } from "@/server-actions/crudUserMaps";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCurrentUserContext } from "./currentUserContext";
import Alert from "@/components/alert";

const IDLE_TIMEOUT = 30000;
const TICK_INTERVAL = 10000;

const MapActivityContext = createContext<{
  isUserActive: boolean;
  totalSeconds: number;
  finishMap: () => Promise<void>;
} | null>(null);

export function MapActivityProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, userMaps, activeMapId } = useCurrentUserContext();
  const activeUserMap = userMaps?.find((um) => um.map_id === activeMapId);

  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isUserActive, setIsUserActive] = useState(true);
  const [showIdleDialog, setShowIdleDialog] = useState(false);

  // 1. Create a Ref to track totalSeconds without triggering re-renders
  const totalSecondsRef = useRef(totalSeconds);

  const tickInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCreatingRef = useRef(false);

  const sessionRecordId = useRef<string | null>(null);

  const isUserActiveRef = useRef(true);
  const showIdleDialogRef = useRef(false);

  useEffect(() => {
    isUserActiveRef.current = isUserActive;
  }, [isUserActive]);

  useEffect(() => {
    showIdleDialogRef.current = showIdleDialog;
  }, [showIdleDialog]);

  // 2. Keep the Ref in sync with state
  useEffect(() => {
    totalSecondsRef.current = totalSeconds;
  }, [totalSeconds]);

  useEffect(() => {
    if (activeUserMap?.id) {
      sessionRecordId.current = activeUserMap.id;
    }
  }, [activeUserMap]);

  // Make the function async
async function syncProgressToDb(mapId: string, seconds: number) {
  if (!currentUser || mapId !== activeMapId) return;

  try {
    // 1. If we already have an ID, just update
    if (sessionRecordId.current) {
      await updateUserMap(sessionRecordId.current, {
        completion_time_seconds: seconds,
      });
    } 
    // 2. If no ID, we need to create one
    else {
      // STOP if a creation is already in progress (prevents duplicates)
      if (isCreatingRef.current) return; 

      isCreatingRef.current = true;

      const result = await createUserMap({
        user_id: currentUser.id,
        map_id: mapId,
        is_completed: false,
        completion_time_seconds: seconds,
      });

      isCreatingRef.current = false;

      // CRITICAL FIX: Update the ref IMMEDIATELY using the server response.
      // Do not wait for the context/props to refresh.
      // Adjust 'result.data.id' below based on your actual API response shape.
      if (result?.data?.id) {
        sessionRecordId.current = result.data.id;
      }
    }
  } catch (err) {
    console.error("Auto-save failed:", err);
    isCreatingRef.current = false; // Reset lock on error
  }
}

  const startTimerLoop = () => {
    if (tickInterval.current) clearInterval(tickInterval.current);

    tickInterval.current = setInterval(() => {
      if (!isUserActiveRef.current || showIdleDialogRef.current) return;

      // 3. Calculate the new time using the Ref (Safe)
      const currentSeconds = totalSecondsRef.current;
      const nextSeconds = currentSeconds + TICK_INTERVAL / 1000;

      // 4. Update State (UI only)
      setTotalSeconds(nextSeconds);

      // 5. Update DB (Side effect runs AFTER calculation, not inside it)
      syncProgressToDb(activeMapId!, nextSeconds);
      
    }, TICK_INTERVAL);
  };

  useEffect(() => {
    if (tickInterval.current) clearInterval(tickInterval.current);
    sessionRecordId.current = null;

    function run() {
      if (!activeMapId || activeUserMap?.is_completed) {
        setTotalSeconds(activeUserMap?.completion_time_seconds || 0);
        return;
      }

      const initialTime = Number(activeUserMap?.completion_time_seconds || 0);
      setTotalSeconds(initialTime);

      if (activeUserMap?.id) sessionRecordId.current = activeUserMap.id;

      startTimerLoop();
    }
    run();

    return () => {
      if (tickInterval.current) clearInterval(tickInterval.current);
    };
  }, [activeMapId, activeUserMap?.is_completed]);

  useEffect(() => {
    const markActive = () => {
      if (showIdleDialogRef.current) return;

      setIsUserActive(true);

      if (idleTimer.current) clearTimeout(idleTimer.current);

      idleTimer.current = setTimeout(() => {
        setIsUserActive(false);
        setShowIdleDialog(true);
      }, IDLE_TIMEOUT);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        setIsUserActive(false);
      } else {
        markActive();
      }
    };

    window.addEventListener("mousemove", markActive);
    window.addEventListener("keydown", markActive);
    window.addEventListener("focus", markActive);
    document.addEventListener("visibilitychange", handleVisibility);
 

    markActive();

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("focus", markActive);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const finishMap = async () => {
    if (!currentUser || !activeMapId) return;

    if (tickInterval.current) clearInterval(tickInterval.current);

    try {
      if (sessionRecordId.current) {
        await updateUserMap(sessionRecordId.current, {
          is_completed: true,
          completion_time_seconds: totalSeconds,
        });
      } else {
        await createUserMap({
          user_id: currentUser.id,
          map_id: activeMapId,
          is_completed: true,
          completion_time_seconds: totalSeconds,
        });
      }
    } catch (err) {
      console.error("Failed to finish map", err);
    }
  };

  return (
    <MapActivityContext.Provider
      value={{ isUserActive, totalSeconds, finishMap }}
    >
      {children}

      <Alert
        open={showIdleDialog}
        title="Still Playing?"
        content="The timer is paused while you are away."
        okText="Resume"
        showCancel={false}
        onOk={() => {
          setIsUserActive(true);
          setShowIdleDialog(false);

          if (activeMapId && !activeUserMap?.is_completed) {
            startTimerLoop();
          }
        }}
      />
    </MapActivityContext.Provider>
  );
}

export const useMapActivity = () => {
  const ctx = useContext(MapActivityContext);
  if (!ctx)
    throw new Error("useMapActivity must be used within MapActivityProvider");
  return ctx;
};