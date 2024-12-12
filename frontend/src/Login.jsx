import React, { useContext, useState } from 'react';
import axios from 'axios';
import { DataContext } from './SockeProvider';
import { useNavigate } from 'react-router-dom';
import baseUrl from './Constant';

export default function Login() {
    const { setToken, setUser, setUserId } = useContext(DataContext);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const onSubmit = () => {
        axios.post(`${baseUrl}/chat-login/`, formData).then((res) => {
            setToken(res.data.access);
            if (res.data.access) {
                setUser(res.data.email);
                setUserId(res.data.user_id);
                navigate('/');
            }
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
                <h4 className="text-3xl font-extrabold text-gray-800 text-center mb-8">Login</h4>
                <input
                    type="text"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl mb-5 focus:outline-none focus:ring-4 focus:ring-blue-400"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl mb-5 focus:outline-none focus:ring-4 focus:ring-blue-400"
                />
                <button
                    onClick={onSubmit}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-400"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
