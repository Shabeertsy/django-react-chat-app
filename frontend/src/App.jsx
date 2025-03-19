import Home from './Home'
import { Routes,Route } from 'react-router-dom'
import Peer from './peer'
import Login from './Login'
import FileDownloadComponent from './FileDownload'
import Chat from './Chat'
import HomePage from './HomePage'




function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='chat/:id' element={<Peer/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/file' element={<FileDownloadComponent/>}/>
      <Route path='/bot' element={<Chat/>}/>
      <Route path='/chat' element={<Home/>}/>

  </Routes>
    </>
  )
}

export default App
