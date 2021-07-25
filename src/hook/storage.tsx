import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, ReactNode, useContext} from 'react';

interface DataProps {
    id: string;
    title: string;
    email: string;
    password: string;
};


interface StorageContextData {
    setItem: (item: DataProps) => Promise<void>;
    getItem: () => Promise<DataProps[]>;
}

interface StorageProviderProps {
    children: ReactNode;
}


const StorageContext = createContext({} as StorageContextData);

function StorageProvider({children}: StorageProviderProps){
    const dataKey = '@passmanager:logins';

    async function getItem() {
        try{
            const dataStorage = await AsyncStorage.getItem(dataKey);

            return dataStorage
            ? JSON.parse(dataStorage)
            : [];
        }catch(err){
            console.log(err);
            throw new Error(err);
        }        
    }

    async function setItem(item: DataProps) {
        try{
            const dataStorage = await AsyncStorage.getItem(dataKey);

            const dataParse = dataStorage
            ? JSON.parse(dataStorage)
            : [];

            const newData = [...dataParse, item];

            await AsyncStorage.setItem(dataKey, JSON.stringify(newData));
        }catch(err){
            console.log(err);
            throw new Error(err);
        }
    }

    return (
        <StorageContext.Provider value={{
            setItem,
            getItem,            
        }}>
            {children}
        </StorageContext.Provider>
    )
}

function useStorage() {
    const context = useContext(StorageContext);
  
    return context;
  }
  
  export { StorageProvider, useStorage };