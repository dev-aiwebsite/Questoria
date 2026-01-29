"use client";

import { imagesData } from "@/data/imagesList";
import { createUser, getUsers, User, UserForm } from "@/server-actions/crudUser";
import React, { createContext, useContext, useEffect, useState } from "react";


type AppDataContextType = {
isFetching: boolean;
users: User[];
setUsers: React.Dispatch<React.SetStateAction<User[]>>;
registerUser: (formData:UserForm) => Promise<User | undefined>;
imagesLoaded: boolean;
setImagesLoaded: React.Dispatch<React.SetStateAction<boolean>>
imagesProgress: number;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
   const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imagesProgress, setImagesProgress] = useState(0);
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setIsFetching(true)
            try {
                const { data } = await getUsers()
                setUsers(data || [])
            } catch (error) {
                console.log(error)
            }
            setIsFetching(false)
        }
        fetchData()
    }, [])

    useEffect(() => {
    if (imagesLoaded) return; // prevent reloading
    
    let loadedCount = 0;
    imagesData.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
        setImagesProgress(Math.round((loadedCount / imagesData.length) * 100));

        if (loadedCount === imagesData.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, [imagesLoaded]);

    async function registerUser(formData:UserForm){
      const {data} = await createUser(formData)
      if(data){
        setUsers([...users,data])
      }

        return data
    }

  return (
    <AppDataContext.Provider value={{imagesProgress, imagesLoaded, setImagesLoaded, registerUser, isFetching, users, setUsers }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }
  return context;
}
