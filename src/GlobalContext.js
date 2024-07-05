// GlobalContext.js
import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [response, setResponse] = useState(null);
  return (
     <GlobalContext.Provider value={{ response, setResponse }}>
      {children}
    </GlobalContext.Provider>
  );
};
