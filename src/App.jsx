
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
import Search from './assets/components/Searchpage/Search'
import Uploadpicture from './assets/components/Uploadpicture/Uploadpicture'
import Setting from './assets/components/Settingspage/Setting'
import Passwordetails from './assets/components/Passwordetailspage/Passwordetails'
import Changepassword from './assets/components/Changepassword/Changepassword'
import AdminDetails from './assets/components/AdminDetails/AdminDetails'
import Makepayment from './assets/components/Makepaymentpage/Makepayment'
import Historyadmin from './assets/components/HistoryAdmin/Historyadmin'
import Funding from './assets/components/Fundingpage/Funding'
// import { useEffect, useState } from 'react'
// import Opaypage from './assets/components/Opaypage'

function App() {
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //     const isPWA =
  //         window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
  //     if (isPWA) {
  //         setLoading(true);
  //         setTimeout(() => {
  //             setLoading(false);
  //         }, 5000); 
  //     }
  // }, []);

  // if (loading) {
  //     return <Opaypage/>;
  // }

  return (
    <>
    <Routes>
      {/* <Route path='/opaydb' element={<Opaypage/>}/> */}
      <Route path='/' element={<UserLogin/>}/>
      {/* <Route path='/userdb' element={<UserDb/>}/> */}
      <Route path="/userdb" element={<ProtectedRoute element={<UserDb />} />} /> 
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
      {/* <Route path='/opay' element={<Opaypage/>}/> */}
      <Route path='/search' element={<Search/>}/>
      <Route path='/upload' element={<Uploadpicture/>}/>
      <Route path='/setting' element={<Setting/>}/>
      <Route path='/passwordetails' element={<Passwordetails/>}/>
      <Route path='/changepassword' element={<Changepassword/>}/>
      <Route path='/details' element={<AdminDetails/>}/>
      <Route path='/makepayment' element={<Makepayment/>}/>
      <Route path='/historyadmin' element={<Historyadmin/>}/>
      <Route path='/funding' element={<Funding/>}/>
      <Route path='*' element={<Notfound/>}/>
    </Routes>
    </>
  )
}

export default App
