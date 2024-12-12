import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { DataContext } from './SockeProvider';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './Home.css'
import baseUrl from './Constant';



export default function Home() {
  const [list, setList] = useState([])
  const { user, userId, token,lastMessage,readyState,statusList,setStatusList } = useContext(DataContext)



  useEffect(() => {

    // if (readyState === ReadyState.CLOSING) {
    //   console.log('Connection is closing. Performing action...');
    //   // Add your custom action here
    // }

    axios.get(`${baseUrl}/user-list/`).then((res) => {
      setList(res.data)
    })
    if (lastMessage !== null) {
      // console.log('connection', JSON.parse(lastMessage.data));
      setStatusList(JSON.parse(lastMessage.data))
    }

  }, [lastMessage,readyState])









  return (
    <div>
      <div className="home-main">
        <div className="home-container">
          <h2>Me : {user ? user : <Link to='/login'>Login</Link>}</h2>
          {
            user && <div className="frd-list">
              <h2>Friends list</h2>

              <ul>
                {
                  list.map((obj, index) => {
                    if (obj.id != userId) {
                      return (
                        <div className="fr-list">
                          <img className='profile-img' src="https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg" alt="" />
                          <li>{obj.first_name ? obj.first_name : obj.email}</li>
                          
                          <Link className='fr-link' to={`chat/${obj.id}`}>  chat</Link>
                                
                          { statusList[obj.id] ? <p className='online-dot'></p> :  <p className='offline-dot'></p> }
                             
                        </div>
                      )
                    }
                  })
                }
              </ul>

            </div>
          }
        </div>
      </div>
    </div>
  )
}
