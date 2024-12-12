import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DataContext } from './SockeProvider';
import baseUrl from './Constant';

export default function Home() {
  const [list, setList] = useState([]);
  const { user, userId, lastMessage, statusList, setStatusList } = useContext(DataContext);

  useEffect(() => {
    axios.get(`${baseUrl}/user-list/`).then((res) => {
      setList(res.data);
    });

    if (lastMessage !== null) {
      setStatusList(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

  return (
    <div className="h-screen bg-gradient-to-r from-green-400 to-blue-500 flex flex-col items-center justify-center">
      {!user && (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to ChatApp</h1>
          <Link 
            to="/login" 
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Login to Chat
          </Link>
        </div>
      )}

      {user && (
        <>
          

          <main className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-6 mt-8">
          <span className="font-medium text-gray-700">Logged in as: {user}</span>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Friends List</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((obj, index) => {
                if (obj.id !== userId) {
                  return (
                    <li
                      key={index}
                      className="flex items-center p-4 bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    >
                      <img
                        className="w-12 h-12 rounded-full mr-4"
                        src="https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"
                        alt="Profile"
                      />
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{obj.first_name ? obj.first_name : obj.email}</p>
                        <Link
                          className="text-blue-500 font-medium underline"
                          to={`chat/${obj.id}`}
                        >
                          Chat
                        </Link>
                      </div>
                      <span
                        className={`w-3 h-3 rounded-full ${statusList[obj.id] ? 'bg-green-500' : 'bg-red-500'}`}
                      ></span>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </main>

          {/* <footer className="w-full text-center p-4 bg-gray-800 text-white mt-8">
            <p>&copy; 2024 ChatApp. All rights reserved.</p>
          </footer> */}
        </>
      )}
    </div>
  );
}
