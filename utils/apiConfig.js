import { baseURL } from "../config";
// console.log('Base URL:', baseURL)
export const API_URLS = {
    userlogin: `${baseURL}/useropay/userlogin`,
    adminlogin: `${baseURL}/useropay/adminlogin`,
    createuser: `${baseURL}/useropay/createuser`,
    useraccount: `${baseURL}/useropay/useraccount`,
    getransactions: (userId)=>`${baseURL}/useropay/getransactions/${userId}`,
    transactions: `${baseURL}/useropay/transactions`,
    getallusers: `${baseURL}/useropay/getallusers`,
    gettransactions: (userId)=>`${baseURL}/useropay/gettransactions/${userId}`,
    getCounts: `${baseURL}/useropay/getCounts`,
    saveRecentTransaction: `${baseURL}/useropay/saveRecentTransaction`,
    // getrecentransaction: `${baseURL}/useropay/getrecentransaction`,
    getrecentransaction: (userId, showAll)=>`${baseURL}/useropay/getrecentransaction/${userId}?showAll=${showAll}`,
    deleterecenttransaction: (transactionId) => `${baseURL}/useropay/deleterecenttransaction/${transactionId}`,
    deleteuserTransaction: (transactionId) => `${baseURL}/useropay/deleteuserTransaction/${transactionId}`,
    changetransactions : (transactionId)=> `${baseURL}/useropay/changetransactions/${transactionId}`,
    getlasttwotrnasaction: (userId)=>`${baseURL}/useropay/getlasttwotrnasaction/${userId}`,
    blockUser: (userId)=>`${baseURL}/useropay/blockUser/${userId}`,
    unblockUser: (userId)=>`${baseURL}/useropay/unblockUser/${userId}`,
    activesessions: `${baseURL}/useropay/activesessions`,
    logoutsession: (sessionId)=>`${baseURL}/useropay/logoutsession/${sessionId}`,
    getuserbalance : `${baseURL}/useropay/getuserbalance`,
    addmoney : `${baseURL}/useropay/addmoney`,
    updatebalance : `${baseURL}/useropay/updatebalance`,
    getTotalBalance : `${baseURL}/useropay/getTotalBalance`,
    getMoneyOut: (userId)=>`${baseURL}/useropay/getMoneyOut/${userId}`,
    updatemoneyout: `${baseURL}/useropay/updatemoneyout`,
    getrecentransactionsearch: (userId)=>`${baseURL}/useropay/getrecentransactionsearch/${userId}`,


};