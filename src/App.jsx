
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
import StoreTransaction from './assets/components/StoreTransactionpage/StoreTransaction'
import TransactionDetails from './assets/components/TransactionDetailspage/TransactionDetails'
import TransactionDetailsBanks from './assets/components/TransactionDetailsBanks/TransactionDetailsBanks'
import Addmoney from './assets/components/Addmoneypage/Addmoney'
import Opaybackup from './assets/components/opaybackup'
import { useEffect, useState } from 'react'

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const isPWA =
          window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
      if (isPWA) {
          setLoading(true);
          setTimeout(() => {
              setLoading(false);
          }, 9000); // Show splash screen for 3 seconds
      }
  }, []);

  if (loading) {
      return <Opaybackup />;
  }

  return (
    <>
    <Routes>
      <Route path='/' element={<UserLogin/>}/>
      {/* <Route path='/userdb' element={<UserDb/>}/> */}
      <Route path="/userdb" element={<ProtectedRoute element={<UserDb />} />} /> {/* Protect UserDb route */}
      <Route path='/admin' element={<Adminlogin/>}/>
      <Route path='/admindb' element={<Admindb/>}/>
      <Route path='/createlogin' element={<CreateUserLogin/>}/>
      <Route path='/bank' element={<Bank/>}/>
      <Route path='/transfer' element={<Transferform/>}/>
      <Route path='/transfersuccess' element={<TransferSuccess/>}/>
      <Route path='/transactionreceipt' element={<TransactionReceipt/>}/>
      <Route path="/storetransaction" element={<StoreTransaction/>}/>
      <Route path='/transactiondetails'element={<TransactionDetails/>}/>
      <Route path='/TransactionDetailsBanks' element={<TransactionDetailsBanks/>}/>
      <Route path='/addmoney' element={<Addmoney/>}/>
      {/* <Route path='/opay' element={<Opaybackup/>}/> */}
      <Route path='*' element={<Notfound/>}/>
    </Routes>
    </>
  )
}

export default App
