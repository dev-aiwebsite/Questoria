"use client";

import { user_checkpoints, user_maps, UserCheckpoint, UserMap } from "@/lib/dummy"; // your User type
import { getUserById, User } from "@/server-actions/crudUser";
import { getUserOnboardingAnswerByUserId, UserOnboardingAnswer } from "@/server-actions/crudUserOnboarding";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

type CurrentUserContextType = {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    maps: UserMap[] | null;
    setMaps: React.Dispatch<React.SetStateAction<UserMap[] | null>>;
    checkpoints: UserCheckpoint[] | null;
    setCheckpoints: React.Dispatch<React.SetStateAction<UserCheckpoint[] | null>>;
    addGems: (amount: number) => void;
    addCheckpointGems: (checkpointId: string, amount: number) => void;
    markCheckpointVisited: (checkpointId: string) => void;
    userOnboarding: UserOnboardingAnswer | null;
    setUserOnboarding: React.Dispatch<React.SetStateAction<UserOnboardingAnswer | null>>;
    isFetching: boolean;
};

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

type Props = {
    children: ReactNode;
};

const STORAGE_KEYS = {
    CURRENT_USER: 'questoria_currentUser',
    CHECKPOINTS: 'questoria_checkpoints',
    ONBOARDINGANSWERS: "questoria_onboarding_answers"
};

export const CurrentUserProvider = ({ children }: Props) => {
    const [isFetching, setIsFetching] = useState(true)
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userOnboarding, setUserOnboarding] = useState<UserOnboardingAnswer | null>(null)

    const [maps, setMaps] = useState<UserMap[] | null>(null)
    const [checkpoints, setCheckpoints] = useState<UserCheckpoint[] | null>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    return parsed;
                }
            } catch (e) {
                console.error('Error loading checkpoints from localStorage:', e);
            }
        }
        return null;
    });
    const currentUserRef = useRef<User | null>(null)

    // Keep ref in sync with state
    useEffect(() => {
        currentUserRef.current = currentUser;
    }, [currentUser])

    useEffect(()=>{

        async function fetchData(){
            setIsFetching(true)

            if(currentUser){
                setIsFetching(false)
                return
            }

            const loggedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            const parsedLoggedUser = loggedUser ? JSON.parse(loggedUser)as User : null 
            if(!parsedLoggedUser){
                setIsFetching(false)
                return
            }

            try {
                    const getUserRes = await getUserById(parsedLoggedUser.id)
                    if(getUserRes.data){
                        setCurrentUser(getUserRes.data)
                    }
                    const getUserOnboardingRes = await getUserOnboardingAnswerByUserId(parsedLoggedUser.id)
                    if(getUserOnboardingRes.data){
                        setUserOnboarding(getUserOnboardingRes.data)
                    }
            } catch (error) {
                console.log(error)
            } finally {
                setIsFetching(false)
                console.log(isFetching, 'setting to false')

            }
        }
        fetchData()

    },[])

    // Save currentUser to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (currentUser) {
                try {
                    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
                } catch (e) {
                    console.error('Error saving currentUser to localStorage:', e);
                }
            } else {
                localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            }
        }
    }, [currentUser]);
    // Save currentUser onboarding answer to localStorage whenever it changes

    // Save checkpoints to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined' && checkpoints) {
            try {
                localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
            } catch (e) {
                console.error('Error saving checkpoints to localStorage:', e);
            }
        }
    }, [checkpoints]);

    // Wrapper to update gems when user is updated
    const updateCurrentUser = (user: User | null) => {
        setCurrentUser(user);
        currentUserRef.current = user;
    };

    // Function to add gems to current user
    const addGems = (amount: number) => {
        setCurrentUser((prevUser) => {
            if (!prevUser) {
                return prevUser;
            }
            const oldGems = prevUser.gems || 0;
            const newGems = oldGems + amount;
            const updatedUser = {
                ...prevUser,
                gems: newGems
            };
            // Update ref immediately
            currentUserRef.current = updatedUser;
            return updatedUser;
        });
    };

    // Function to add gems to a specific checkpoint
    const addCheckpointGems = (checkpointId: string, amount: number) => {
        const userId = currentUserRef.current?.id;
        if (!userId) return;

        setCheckpoints((prev) => {
            if (!prev) {
                // If no checkpoints exist, create one
                return [{
                    id: `new-${checkpointId}-${Date.now()}`,
                    user_id: userId,
                    checkpoint_id: checkpointId,
                    is_visited: false,
                    challenges: {
                        selfie: "",
                        quiz: "",
                        happiness: 0
                    },
                    gems_collected: amount
                }];
            }

            const existingCheckpoint = prev.find(cp => cp.checkpoint_id === checkpointId);
            if (existingCheckpoint) {
                // Update existing checkpoint
                return prev.map((cp) => {
                    if (cp.checkpoint_id === checkpointId) {
                        return {
                            ...cp,
                            gems_collected: (cp.gems_collected || 0) + amount
                        };
                    }
                    return cp;
                });
            } else {
                // Create new checkpoint entry
                return [...prev, {
                    id: `new-${checkpointId}-${Date.now()}`,
                    user_id: userId,
                    checkpoint_id: checkpointId,
                    is_visited: false,
                    challenges: {
                        selfie: "",
                        quiz: "",
                        happiness: 0
                    },
                    gems_collected: amount
                }];
            }
        });
    };

    // Function to mark a checkpoint as visited
    const markCheckpointVisited = (checkpointId: string) => {
        const userId = currentUserRef.current?.id;
        if (!userId) return;

        setCheckpoints((prev) => {
            if (!prev) {
                // If no checkpoints exist, create one
                return [{
                    id: `new-${checkpointId}-${Date.now()}`,
                    user_id: userId,
                    checkpoint_id: checkpointId,
                    is_visited: true,
                    challenges: {
                        selfie: "",
                        quiz: "",
                        happiness: 0
                    },
                    gems_collected: 0
                }];
            }

            const existingCheckpoint = prev.find(cp => cp.checkpoint_id === checkpointId);
            if (existingCheckpoint) {
                // Update existing checkpoint
                return prev.map((cp) => {
                    if (cp.checkpoint_id === checkpointId) {
                        return {
                            ...cp,
                            is_visited: true
                        };
                    }
                    return cp;
                });
            } else {
                // Create new checkpoint entry
                return [...prev, {
                    id: `new-${checkpointId}-${Date.now()}`,
                    user_id: userId,
                    checkpoint_id: checkpointId,
                    is_visited: true,
                    challenges: {
                        selfie: "",
                        quiz: "",
                        happiness: 0
                    },
                    gems_collected: 0
                }];
            }
        });
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
            // Merge saved checkpoints with dummy data checkpoints
            if (checkpointsRes) {
                setCheckpoints((prevSaved) => {
                    if (!prevSaved) {
                        return checkpointsRes;
                    }
                    // Merge: use saved checkpoint data if exists, otherwise use dummy data
                    const merged = checkpointsRes.map(dummyCp => {
                        const saved = prevSaved.find(sc => sc.checkpoint_id === dummyCp.checkpoint_id);
                        if (saved) {
                            // Use saved data but keep dummy data structure
                            return {
                                ...dummyCp,
                                is_visited: saved.is_visited,
                                gems_collected: saved.gems_collected,
                                challenges: saved.challenges || dummyCp.challenges
                            };
                        }
                        return dummyCp;
                    });
                    // Add any saved checkpoints that don't exist in dummy data
                    prevSaved.forEach(savedCp => {
                        if (!merged.find(m => m.checkpoint_id === savedCp.checkpoint_id)) {
                            merged.push(savedCp);
                        }
                    });
                    return merged;
                });
            }
        });


    }, [currentUser])

    return (
        <CurrentUserContext.Provider value={{isFetching, userOnboarding, setUserOnboarding, maps, setMaps, checkpoints, setCheckpoints, currentUser, setCurrentUser: updateCurrentUser, addGems, addCheckpointGems, markCheckpointVisited }}>
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
