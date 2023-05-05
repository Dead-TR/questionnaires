import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuth, Auth, User } from "firebase/auth";

import { firebaseSighIn } from "./signIn";
import { fireBaseSightOut } from "./signOut";

export const auth = getAuth();

const AuthContext = createContext<{
  sighIn: (email: string, password: string) => void;
  sightOut: () => void;
  user: User | null;
}>({ sighIn: () => {}, sightOut: () => {}, user: null });

interface Props {
  children?: React.ReactNode;
}
export const AuthProvider: FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        sighIn: firebaseSighIn,
        sightOut: fireBaseSightOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
