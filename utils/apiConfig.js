import { baseURL } from "../config";
// console.log('Base URL:', baseURL)
export const API_URLS = {
    userlogin: `${baseURL}/useropay/userlogin`,
    adminlogin: `${baseURL}/useropay/adminlogin`,
    createuser: `${baseURL}/useropay/createuser`,
    useraccount: `${baseURL}/useropay/useraccount`,
    getransactions: (userId)=>`${baseURL}/useropay/getransactions/${userId}`,
    transactions: `${baseURL}/useropay/transactions`,
   
};