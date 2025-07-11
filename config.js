const isProduction = window.location.hostname !== 'localhost';

export const baseURL = isProduction 
  ? 'https://opay-backend.onrender.com'   
  : 'http://localhost:4000';  


  