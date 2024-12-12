import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const DataContext = createContext();


export const DataProvider = ({ children }) => {
    const [token, setToken] = useState('')
    const [user, setUser] = useState('')
    const [userId, setUserId] = useState('')
    const { sendMessage, lastMessage, readyState } = useWebSocket(
        token ? `wss://crdrops.xyz/api/online/?token=${token}` : null
    );
    const [statusList, setStatusList] = useState([])



    const contextData = {
        setToken: setToken,
        token: token,
        setUser: setUser,
        user: user,
        userId: userId,
        setUserId: setUserId,
        statusList: statusList,
        setStatusList: setStatusList,
        lastMessage: lastMessage
    };



    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];


    return (
        <DataContext.Provider value={contextData}>
            {children}
        </DataContext.Provider>)
}
