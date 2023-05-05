import { FC } from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";

import { PathProvider } from "hooks";
import { fireBaseApp } from "config/fireBase";
import { AuthProvider } from "./list";

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
            <>{children}</>
          </AuthProvider>
        </PathProvider>
      </BrowserRouter>
    </>
  );
};

export default Providers;
export * from "./list";
