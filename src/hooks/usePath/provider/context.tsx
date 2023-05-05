import React from "react";

import { PathContextType } from "./type";

const defaultValues: PathContextType = {
  page: {
    path: "",
    navigate: () => {},
    isHavePrevHistory: false,
  },
  searchParams: {
    params: {},
    change: () => {},
    clear: () => {},
    delete: () => {},
  },
  defaultLocation: {
    hash: "",
    key: "",
    pathname: "",
    search: "",
    state: {},
  },
};

export const Context = React.createContext<PathContextType>(defaultValues);

export default Context;
