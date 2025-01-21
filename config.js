const isProduction = window.location.hostname !== 'localhost';

export const baseURL = isProduction 
  ? 'https://candyopay.onrender.com'   
  : 'http://localhost:4000';  


  