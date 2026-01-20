"use client";

import { createUser, getUsers, User, UserForm } from "@/server-actions/crudUser";
import React, { createContext, useContext, useEffect, useState } from "react";


type AppDataContextType = {
isFetching: boolean;
users: User[];
setUsers: React.Dispatch<React.SetStateAction<User[]>>;
registerUser: (formData:UserForm) => Promise<User | undefined>;
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

    async function registerUser(formData:UserForm){
      const {data} = await createUser(formData)
      if(data){
        setUsers([...users,data])
      }

        return data
    }

  return (
    <AppDataContext.Provider value={{registerUser, isFetching, users, setUsers }}>
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
