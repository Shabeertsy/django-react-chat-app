import React, { useState } from 'react'
import axios from 'axios'
import './Chat.css'

export default function Chat() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [responses, setResponses] = useState([]);

    const OnSendHandler = () => {

        axios.post(`http://localhost:8000/api/chatbot/`, { 'que': question }).then((res) => {
            console.log('res', res.data);
            setAnswer(res.data)
            setResponses([...responses, res.data]);
        })
    }



    return (
        <div>

            <div className="bot-main">
                <div className="bot-container">
                    <h2>chat bot</h2>
                    <div className="bot-chat">
                        <input type="text" className='bot-inp' onChange={(e) => setQuestion(e.target.value)} />
                        <button className='bot-btn' onClick={OnSendHandler}>Send</button>
                        {responses.map((response, index) => (
                            <p key={index}>Response {index + 1}: {response.res}</p>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}
