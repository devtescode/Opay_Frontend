
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
import TransferSuccess from './assets/components/TransferSuccessPage/TransferSuccess'
import TransactionReceipt from './assets/components/TransactionReceiptpage/TransactionReceipt'
import { useEffect, useState } from 'react'
import SplashScreen from './assets/components/SplashScreenpage/SplashScreen'

function App() {
  const [isLoading, setIsLoading] = useState(true); // Track whether the splash screen should be shown
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide the splash screen after 3 seconds
    }, 3000);
    return () => clearTimeout(timer); // Cleanup timer when the component unmounts
  }, []);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
  return (
    <>
     {isLoading ? ( // Display the splash screen while loading
        <SplashScreen/>
      ) : (
      <Routes>
        <Route path='/' element={<UserLogin />} />
        {/* <Route path='/userdb' element={<UserDb/>}/> */}
        <Route path="/userdb" element={<ProtectedRoute element={<UserDb />} />} /> {/* Protect UserDb route */}
        <Route path='/admin' element={<Adminlogin />} />
        <Route path='/admindb' element={<Admindb />} />
        <Route path='/createlogin' element={<CreateUserLogin />} />
        <Route path='/bank' element={<Bank />} />
        <Route path='/transfer' element={<Transferform />} />
        <Route path='/transfersuccess' element={<TransferSuccess />} />
        <Route path='/transactionreceipt' element={<TransactionReceipt />} />
        <Route path='*' element={<Notfound />} />
      </Routes>
      )}
    </>
  )
}

export default App
