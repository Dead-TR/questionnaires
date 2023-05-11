import { FC } from "react";
import { BrowserRouter } from "react-router-dom";

import { PathProvider } from "hooks";
import { fireBaseApp } from "config/fireBase";
import { AuthProvider, ProfilesProvider } from "./list";

interface Props {
  children?: React.ReactNode;
}

const isInit = !!fireBaseApp;

const Providers: FC<Props> = ({ children }) => {
  if (!isInit) return null;
  return (
    <>
      <BrowserRouter>
        <PathProvider>
          <AuthProvider>
            <ProfilesProvider>
              <>{children}</>
            </ProfilesProvider>
          </AuthProvider>
        </PathProvider>
      </BrowserRouter>
    </>
  );
};

export default Providers;
export * from "./list";
