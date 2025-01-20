
import { Route, Routes } from 'react-router-dom'
import './App.css'
import UserLogin from './assets/components/UserLoginpage/UserLogin'
import UserDb from './assets/components/UserDbpage/UserDb'
import Adminlogin from './assets/components/Adminloginpage/Adminlogin'
import Admindb from './assets/components/Admindbpage/Admindb'
import Notfound from './assets/components/Notfoundpage/Notfound'
import CreateUserLogin from './assets/components/CreateUserLoginPage/CreateUserLogin'
import ProtectedRoute from './assets/components/ProtectedRouteUser/ProtectedRoute'
import Bank from './assets/components/Bankpage/Bank'
import Transferform from './assets/components/Transferformpage/Transferform'
import Transfarmodal from './assets/components/Transfermodalpage/Transfarmodal'

function App() {

  return (
    <>
    <Routes>
      <Route path='/userlogin' element={<UserLogin/>}/>
      {/* <Route path='/userdb' element={<UserDb/>}/> */}
      <Route path="/userdb" element={<ProtectedRoute element={<UserDb />} />} /> {/* Protect UserDb route */}
      <Route path='/admin' element={<Adminlogin/>}/>
      <Route path='/admindb' element={<Admindb/>}/>
      <Route path='/createlogin' element={<CreateUserLogin/>}/>
      <Route path='/bank' element={<Bank/>}/>
      <Route path='/transfer' element={<Transferform/>}/>
      <Route path='/transfermodal' element={<Transfarmodal/>}/>
      <Route path='*' element={<Notfound/>}/>
    </Routes>
    </>
  )
}

export default App
