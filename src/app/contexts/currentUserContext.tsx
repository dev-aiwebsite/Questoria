"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, user_checkpoints, user_maps, UserCheckpoint, UserMap } from "@/lib/dummy"; // your User type

type CurrentUserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  maps: UserMap[] | null;
  setMaps: React.Dispatch<React.SetStateAction<UserMap[] | null>>; 
  checkpoints: UserCheckpoint[] | null;
  setCheckpoints: React.Dispatch<React.SetStateAction<UserCheckpoint[] | null>>;
  addGems: (amount: number) => void;
};

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

type Props = {
    children: ReactNode;
};

export const CurrentUserProvider = ({ children }: Props) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [maps, setMaps] = useState<UserMap[] | null>(null)
    const [checkpoints, setCheckpoints] = useState<UserCheckpoint[] | null>(null)

    // Wrapper to update gems when user is updated
    const updateCurrentUser = (user: User | null) => {
        setCurrentUser(user);
    };

    // Function to add gems to current user
    const addGems = (amount: number) => {
        if (currentUser) {
            setCurrentUser({
                ...currentUser,
                gems: (currentUser.gems || 0) + amount
            });
        }
    };

    useEffect(() => {
        if (!currentUser) return
        const currentUserId = currentUser.id
        const checkpointsRes = user_checkpoints.filter(c => c.user_id == currentUserId)
        const mapsRes = user_maps.filter(m => m.user_id == currentUserId)
           
        queueMicrotask(() => {
            if (mapsRes) {
                setMaps(mapsRes)
            }
            if (checkpointsRes) {
                setCheckpoints(checkpointsRes)
            }
        });


    }, [currentUser])

    return (
        <CurrentUserContext.Provider value={{ maps, setMaps, checkpoints, setCheckpoints, currentUser, setCurrentUser: updateCurrentUser, addGems }}>
            {children}
        </CurrentUserContext.Provider>
    );
};

// Custom hook for easier usage
export const useCurrentUserContext = () => {
    const context = useContext(CurrentUserContext);
    if (!context) {
        throw new Error("useCurrentUser must be used within a CurrentUserProvider");
    }
    return context;
};
