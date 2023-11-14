import React, { useContext, useState } from 'react'
import axios from 'axios'
import { DataContext } from './SockeProvider'
import { useNavigate } from 'react-router-dom'
import './Login.css'


export default function Login() {
    const {setToken,token,setUser,setUserId}=useContext(DataContext)
    const [formData,setFormData]=useState({
            email:'',
            password:''
    })
 

    const navigate=useNavigate()
    const handleInputChange = (event) => {
        const { name, value } = event.target;

            setFormData({
                ...formData,
                [name]: value,
            });
    
    };

    const onSubmit=()=>{
        axios.post('http://localhost:8000/chat-login/',formData).then((res)=>{
            setToken(res.data.access)
            if (res.data.access){
                setUser(res.data.email)
                setUserId(res.data.user_id)
                navigate('/')
            }
        })
    }



    return (
        <div>
            <div className="login-main">
                <div className="login-container">
                    <h4>Login</h4>
                    <input type="text" name='email' placeholder='Enter your email' onChange={handleInputChange} /><br />
                    <input type="text" name='password' placeholder='password' onChange={handleInputChange} /><br />
                    <button onClick={onSubmit}>Login</button>
                </div>

            </div>
        </div>
    )
}
