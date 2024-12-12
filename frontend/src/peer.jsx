import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useParams } from 'react-router-dom';
import { DataContext } from './SockeProvider';
import axios from 'axios';
import FileDownloadComponent from './FileDownload';
import baseUrl from './Constant';

export default function Peer() {
    const { id } = useParams();
    const { token, user, userId } = useContext(DataContext);

    const [socketUrl] = useState(`wss://crdrops.xyz/api/chat/${id}/?token=${token}`);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    const [messageHistory, setMessageHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [friend, setFriend] = useState({});
    const [file, setFile] = useState(null);
    const chatBoxRef = useRef();

    useEffect(() => {
        if (lastMessage) {
            setMessageHistory((prev) => [...prev, JSON.parse(lastMessage.data)]);
        }
        scrollToBottom();
        axios.get(`${baseUrl}/get-user/${id}/`).then((res) => setFriend(res.data));
    }, [lastMessage]);

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`${baseUrl}/upload-files/${userId}/${id}/`, formData).then(() => setFile(null));
    };

    const handleClickSendMessage = useCallback(() => {
        if (message.trim() || file) {
            const messageObject = { sender_name: user, message };
            sendMessage(JSON.stringify(messageObject));
            setMessage('');
            setFile(null);
            scrollToBottom();
        }
    }, [message, file, sendMessage, user]);

    const scrollToBottom = () => {
        chatBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Connected',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Disconnected',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 text-white">
            {/* Header */}
            <header className="p-4 w-full bg-indigo-600 text-center shadow-lg flex items-center justify-between relative">
                <h1 className="text-lg md:text-2xl font-bold">Chat with {friend.first_name || 'Friend'}</h1>
                <span
                    className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'Connected' ? 'bg-green-500' : 'bg-red-500'
                        } absolute top-4 right-4`}
                    title={connectionStatus}
                ></span>
            </header>

            {/* Chat Container */}
            <div className="flex-1 w-full max-w-5xl flex justify-center p-4">
                <div className="w-full md:w-3/4 bg-purple-700 text-gray-800 rounded-lg shadow-lg flex flex-col">
                    {/* Chat Messages */}
                    <main className="flex-1 overflow-y-auto p-4 space-y-4">
                        <ul className="space-y-4" ref={chatBoxRef}>
                            {messageHistory.map((msg, index) => (
                                <li
                                    key={index}
                                    className={`flex items-start ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`p-3 max-w-xs md:max-w-sm rounded-lg shadow ${msg.sender_id === userId
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                        }`}
                                    >
                                        {msg.mode === 'file' ? (
                                            <FileDownloadComponent
                                                url={msg.file}
                                                file_id={msg.file_id}
                                                className="w-32 h-32 object-cover"
                                            />
                                        ) : (
                                            <span>{msg.message}</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </main>

                    {/* Input Section */}
                    <footer className="p-4 bg-gray-100 flex items-center space-x-2">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <img
                                className="w-8 h-8"
                                src="https://icon-library.com/images/upload-icon/upload-icon-17.jpg"
                                alt="Upload"
                            />
                        </label>
                        <input
                            type="text"
                            className="flex-1 p-2 rounded bg-gray-200 text-gray-800"
                            placeholder="Type a message..."
                            value={file ? file.name : message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                setFile(null);
                            }}
                        />
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={file ? handleUpload : handleClickSendMessage}
                            disabled={readyState !== ReadyState.OPEN}
                        >
                            Send
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
}
