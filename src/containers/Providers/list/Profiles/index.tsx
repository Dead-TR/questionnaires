import React, { FC, createContext, useContext } from "react";

const Context = createContext<{}>({});

interface Props {
  children?: React.ReactNode;
}
export const ProfilesProvider: FC<Props> = ({ children }) => {
  return <Context.Provider value={{}}>{children}</Context.Provider>;
};

export const useProfiles = () => useContext(Context);
