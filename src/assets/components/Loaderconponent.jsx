import React, { useState, useEffect, createElement } from 'react';
import Opaypage from './Opaypage';

const Loaderconponent = ({children}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApp = setTimeout(() => {
      setLoading(false);
    }, 3000); // Fake loading time

    return () => clearTimeout(loadApp);
  }, []);

  return (
    <>
      {loading ? <Opaypage/> : (children)}
    </>

  );
};


export default Loaderconponent;