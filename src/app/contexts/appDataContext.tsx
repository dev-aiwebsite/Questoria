"use client";

import { getUsers, User } from "@/server-actions/crudUser";
import React, { createContext, useContext, useEffect, useState } from "react";


type AppDataContextType = {
isFetching: boolean;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
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

  return (
    <AppDataContext.Provider value={{isFetching, users, setUsers }}>
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
