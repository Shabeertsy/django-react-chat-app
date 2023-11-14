import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './Peer.css'
import { useParams } from 'react-router-dom';
import { DataContext } from './SockeProvider';
import axios from 'axios';
import FileDownloadComponent from './FileDownload';



function Peer() {
    const { id } = useParams();
    const { token, user, userId } = useContext(DataContext)


    const [socketUrl, setSocketUrl] = useState(`ws://localhost:8000/chat/${id}/?token=${token}`);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    const [messageHistory, setMessageHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [myMessage, setMyMessage] = useState([])
    const [friend, setFriend] = useState([])
    const [file, setFile] = useState([])
    const [fileData, setFileData] = useState([])
    const chatBoxRef = useRef();


    const getUser = async () => {
        await axios.get(`http://localhost:8000/get-user/${id}/`).then((res) => {
            setFriend(res.data)
        })
    }


    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
        scrollToBottom();
        getUser()

    }, [lastMessage, setMessageHistory, sendMessage]);


    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`http://localhost:8000/upload-files/${userId}/${id}/`, formData).then((res) => {
        })
    }



    let sender_name;
    const handleClickSendMessage = useCallback(() => {
        sender_name = 'shabeer'
        setFile('')

        const messageObject = { sender_name: sender_name, message };
        if (message != '') {
            sendMessage(JSON.stringify(messageObject), (result) => {
                setMyMessage(result);
            });
            setMessage('');
            scrollToBottom();
        }
    }, [message]);



    const scrollToBottom = () => {
        const latestMessage = chatBoxRef.current.lastChild;
        if (latestMessage) {
            latestMessage.scrollIntoView({ behavior: 'smooth' });
        }
    };


    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];



    return (
        <div className='peer-main'>
            <h3>Let's chat  </h3>
            <div className="container">

                <p>WebSocket Status :  <i className={connectionStatus == 'Open' ? 'online' : 'offline'}>{connectionStatus}</i></p>
                <h4 className='my-name'> me:  {user}</h4>
                <h4 className='frd-name'> friend:  {friend.first_name}</h4>

                <div className="chat-box" >
                    <ul className="message-list" ref={chatBoxRef}>
                        {messageHistory.map((message, id) => {
                            if (JSON.parse(message.data).mode == 'file') {
                                return (
                                    <div className={JSON.parse(message.data).sender_id == userId ? 'my_img' : 'other_img'}>
                                        <FileDownloadComponent url={message ? JSON.parse(message.data).file : null} file_id={message ? JSON.parse(message.data).file_id : null} />
                                        {console.log(message ? JSON.parse(message.data) : null)}
                                        {/* <img className='send-file' src={message ? JSON.parse(message.data).file : null} alt="img" /> */}
                                    </div>)
                            } else {
                                return (

                                    <div className={JSON.parse(message.data).sender_id == userId ? 'my_msg' : 'other_msg'}>
                                        <span> {message ? JSON.parse(message.data).message : null}</span>
                                    </div>
                                )
                            }
                        })}

                    </ul>

                    <input type="file" id="fileInput" className="hidden-input" onChange={(e) => setFile(e.target.files[0])} />
                    <label htmlFor="fileInput" className="custom-file-input">
                       <img className='file-download-img' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1MwHVGkJqvRfMdJKpEzNPQjp6rEPMZlq_1X_vlweSOckCyfdehT0vwjO_tPJ3GlHlgtg&usqp=CAU" alt="" />
                    </label>

                    <input className='inp' value={file != '' ? file.name :  message} type="text" name="" id="" onChange={(e) => {
                        setMessage(e.target.value)
                        setFile('')
                    }} />

                    <button className='btn' onClick={file ? handleUpload : handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>Send</button>
                </div>

            </div>
        </div>
    );
};

export default Peer;
