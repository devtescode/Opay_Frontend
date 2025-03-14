
import { Route, Routes, useNavigate } from 'react-router-dom'
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
// import { useEffect, useState } from 'react'
import Opaypage from './assets/components/Opaypage'
import { useEffect, useState } from 'react'

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

  // const [showSplash, setShowSplash] = useState(false);

  // useEffect(() => {
  //   const hasVisited = localStorage.getItem("hasVisited");

  //   if (!hasVisited) {
  //     setShowSplash(true);
  //     setTimeout(() => {
  //       setShowSplash(false);
  //       localStorage.setItem("hasVisited", "true"); // Mark as seen
  //     }, 3000);
  //   }
  // }, []);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/opaydb", { replace: true }); // Ensure splash shows on first load
    }

    setTimeout(() => {
      setShowSplash(false);
      navigate("/", { replace: true }); // Redirect to main page after 3 sec
    }, 3000);
  }, []);

  return (
    <Routes>
      {/* Show Splash Screen First */}
      {showSplash ? (
        <Route path="*" element={<Opaypage />} />
      ) : (
        <>
          <Route path="/opaydb" element={<Opaypage />} />
          <Route path="/" element={<UserLogin />} />
          <Route path="/userdb" element={<ProtectedRoute element={<UserDb />} />} />
          <Route path="/admin" element={<Adminlogin />} />
          <Route path="/admindb" element={<Admindb />} />
          <Route path="/createlogin" element={<CreateUserLogin />} />
          <Route path="/bank" element={<Bank />} />
          <Route path="/transfer" element={<Transferform />} />
          <Route path="/transfersuccess" element={<TransferSuccess />} />
          <Route path="/transactionreceipt" element={<TransactionReceipt />} />
          <Route path="/storetransaction" element={<StoreTransaction />} />
          <Route path="/transactiondetails" element={<TransactionDetails />} />
          <Route path="/TransactionDetailsBanks" element={<TransactionDetailsBanks />} />
          <Route path="/addmoney" element={<Addmoney />} />
          <Route path="*" element={<Notfound />} />
        </>
      )}
    </Routes>

  )
}

export default App
