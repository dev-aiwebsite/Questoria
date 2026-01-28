"use client";

import { excludedCheckpointIds } from "@/app/(authenticated)/lite/(with-nav)/map/(withActivityLogger)/page";
import { checkpoints as checkpointsData } from "@/lib/dummy";
import { getUserById, User } from "@/server-actions/crudUser";
import { createUserCheckpoint, getUserCheckpointsByUserId, updateUserCheckpoint, UserCheckpoint } from "@/server-actions/crudUserCheckpoint";
import { getUserMapsByUserId, updateUserMap, UserMap } from "@/server-actions/crudUserMaps";
import { getUserOnboardingAnswerByUserId, UserOnboardingAnswer } from "@/server-actions/crudUserOnboarding";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useAppRouter } from "./appRouter";

type CurrentUserContextType = {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    userMaps: UserMap[] | null;
    setUserMaps: React.Dispatch<React.SetStateAction<UserMap[] | null>>;
    activeMapId: string;
    setActiveMapId: React.Dispatch<React.SetStateAction<string>>;
    userCheckpoints: UserCheckpoint[] | null;
    setUserCheckpoints: React.Dispatch<React.SetStateAction<UserCheckpoint[] | null>>;
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

export const CurrentUserProvider = ({ children }: Props) => {
    const { data: session, status } = useSession()
    const [isFetching, setIsFetching] = useState(true)
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userOnboarding, setUserOnboarding] = useState<UserOnboardingAnswer | null>(null)
    const router = useAppRouter()

    const [userMaps, setUserMaps] = useState<UserMap[] | null>(null)
    const [activeMapId, setActiveMapId] = useState("234j3h4j3")
    const [userCheckpoints, setUserCheckpoints] = useState<UserCheckpoint[] | null>(null);

    const currentUserRef = useRef<User | null>(null)
    const checkpointsRef = useRef<UserCheckpoint[] | null>(null);
    const visibleCheckpoints = checkpointsData.filter(c => !excludedCheckpointIds.includes(c.id));
    // Keep ref in sync with state
    useEffect(() => { checkpointsRef.current = userCheckpoints; }, [userCheckpoints]);
    useEffect(() => {
        currentUserRef.current = currentUser;
    }, [currentUser])

    useEffect(() => {
        if (status !== 'authenticated' || currentUser) return

        queueMicrotask(async () => {
            if (!session) return
            setIsFetching(true)

            try {
                const currentUserId = session.user.id
                const { data: userResData } = await getUserById(currentUserId)
                if (!userResData) {
                    setIsFetching(false)
                    return
                }
                setCurrentUser(userResData)

                const getUserOnboardingRes = await getUserOnboardingAnswerByUserId(currentUserId)
                if (getUserOnboardingRes.data) {
                    setUserOnboarding(getUserOnboardingRes.data)
                }
                const { data } = await getUserCheckpointsByUserId(currentUserId)
                if (data) {
                    setUserCheckpoints(data)
                }

                 const mapsRes = await getUserMapsByUserId(currentUserId)
                if (mapsRes.data) {
                    setUserMaps(mapsRes.data)
                }

            } catch (error) {
                console.log(error)
            } finally {
                setIsFetching(false)
                console.log(isFetching, 'setting to false')

            }
        })


    }, [status])

    useEffect(() => {
        if (!currentUser) return
        const currentUserId = currentUser.id

        queueMicrotask(async () => {
            let userCheckpnts: UserCheckpoint[] = []

            if (!userCheckpoints) {
                const { data } = await getUserCheckpointsByUserId(currentUserId)
                if (data) {
                    userCheckpnts = data
                    setUserCheckpoints(data)
                }
            }

            // Merge saved checkpoints with dummy data checkpoints
            if (userCheckpnts) {
                setUserCheckpoints((prevSaved) => {
                    if (!prevSaved) {
                        return userCheckpnts;
                    }
                    // Merge: use saved checkpoint data if exists, otherwise use dummy data
                    const merged = userCheckpnts.map(dummyCp => {
                        const saved = prevSaved.find(sc => sc.checkpoint_id === dummyCp.checkpoint_id);
                        if (saved) {
                            // Use saved data but keep dummy data structure
                            return {
                                ...dummyCp,
                                is_visited: saved.is_visited,
                                gems_collected: saved.gems_collected,
                                selfie: saved.selfie || dummyCp.selfie,
                                quiz: saved.quiz || dummyCp.quiz,
                                happiness: saved.happiness || dummyCp.happiness

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
    
    // Wrapper to update gems when user is updated
    const updateCurrentUser = (user: User | null) => {
        setCurrentUser(user);
        currentUserRef.current = user;
    };

    // Function to add gems to a specific checkpoint
    const addCheckpointGems = (checkpointId: string, amount: number) => {
        const latestUser = currentUserRef.current;
        const userId = latestUser?.id;
        if (!userId) return;

        const currentList = checkpointsRef.current || [];
        const existingIndex = currentList.findIndex(cp => cp.checkpoint_id === checkpointId);

        let newCheckpointData: UserCheckpoint;
        let newCheckpointsList: UserCheckpoint[];

        if (existingIndex > -1) {
            const existingCp = currentList[existingIndex];

            newCheckpointData = {
                ...existingCp,
                gems_collected: amount
            };

            newCheckpointsList = [...currentList];
            newCheckpointsList[existingIndex] = newCheckpointData;
                updateUserCheckpoint(checkpointId, {is_visited:true, gems_collected: amount })
            .catch((error) => {
                console.log("Failed to save checkpoint gems:", error);
            });

        } else {

            newCheckpointData = {
                id: nanoid(10),
                user_id: userId,
                checkpoint_id: checkpointId,
                is_visited: true,
                selfie: "",
                quiz: "",
                happiness: 0,
                gems_collected: amount
            };
            newCheckpointsList = [...currentList, newCheckpointData];
            createUserCheckpoint(newCheckpointData) 
                 .catch(err => console.error("Failed to create checkpoint:", err));
        }

        const totalUserGems = newCheckpointsList.reduce((sum, cp) => sum + (cp.gems_collected || 0), 0);

        setCurrentUser((prev) => {
            if (!prev) return null;
            const updated = { ...prev, gems: totalUserGems };
            currentUserRef.current = updated;
            return updated;
        });

        setUserCheckpoints(newCheckpointsList);
        checkpointsRef.current = newCheckpointsList;


        //check if map is completed
        const visitedIds = new Set(newCheckpointsList.map(c => c.checkpoint_id));
        const allVisibleVisited = visibleCheckpoints.every(vCp => visitedIds.has(vCp.id));
        console.log(allVisibleVisited, 'allVisibleVisited')
        if (allVisibleVisited) setMapComplete();
    };

    // Function to mark a checkpoint as visited
        const markCheckpointVisited = (checkpointId: string) => {
            const userId = currentUserRef.current?.id;
            if (!userId) return;

            const currentList = checkpointsRef.current || [];
            const existingIndex = currentList.findIndex(cp => cp.checkpoint_id === checkpointId);

            if (existingIndex > -1 && currentList[existingIndex].is_visited) {
                return;
            }

            let newCheckpointData: UserCheckpoint;
            let newCheckpointsList: UserCheckpoint[];

            if (existingIndex > -1) {
                newCheckpointData = {
                    ...currentList[existingIndex],
                    is_visited: true
                };
                newCheckpointsList = [...currentList];
                newCheckpointsList[existingIndex] = newCheckpointData;
            } else {
                newCheckpointData = {
                    id: nanoid(10),
                    user_id: userId,
                    checkpoint_id: checkpointId,
                    is_visited: true,
                    selfie: "",
                    quiz: "",
                    happiness: 0,
                    gems_collected: 0
                };
                newCheckpointsList = [...currentList, newCheckpointData];
            }

            setUserCheckpoints(newCheckpointsList);
            checkpointsRef.current = newCheckpointsList;

            updateUserCheckpoint(checkpointId, { is_visited: true })
                .catch((error) => {
                    console.error(`Failed to mark checkpoint ${checkpointId} as visited:`, error);
                });
        };

        function setMapComplete() {
            if (!userMaps || !activeMapId) return;
            const currentUserMap = userMaps.find(um => um.map_id == activeMapId)
            
            if(!currentUserMap) return

            if(currentUserMap.is_completed){
                router.push('/lite/map/complete')
                return
            }

            try {
                updateUserMap(currentUserMap.id, {is_completed: true})
            } catch (error) {
                console.log(error)
            }
            
            const newUserMaps = userMaps.map(um => 
                um.map_id === activeMapId
                ? { ...um, is_completed: true }
                : um
            );

            setUserMaps(newUserMaps);
            router.push('/lite/map/complete')
        }

    
    return (
        <CurrentUserContext.Provider value={{activeMapId, setActiveMapId, isFetching, userOnboarding, setUserOnboarding, userMaps, setUserMaps, userCheckpoints, setUserCheckpoints, currentUser, setCurrentUser: updateCurrentUser, addCheckpointGems, markCheckpointVisited }}>
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
