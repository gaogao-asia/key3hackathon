import { createContext, useContext } from "react";

const daoContext = createContext(null);

export const DAOContextProvider = (props) => {
  return (
    <daoContext.Provider value={props.value}>
      {props.children}
    </daoContext.Provider>
  );
};

export const useDAOContext = () => {
  return useContext(daoContext);
};
