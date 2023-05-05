import React, { FC, useEffect, useState } from "react";
import { useLocation, useNavigate, NavigateOptions, To } from "react-router";
import { NavigateFunction } from "react-router-dom";

import { SearchParams, SearchParamsState } from "../type";
import { clearSlash, parseSearchParams } from "../utils";
import Context from "./context";

interface Props {
  children?: React.ReactNode;
}

interface PathState {
  pagePath: string;
  searchParams: SearchParams;
}

const modalSplitter = "/modal/";

export const PathProvider: FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPath = () => {
    const { pathname } = location;

    const [pagePath] = pathname.split(modalSplitter) as [
      string?,
      string?,
    ];

    return {
      pagePath: pagePath || "/",
    };
  };

  const [state, setState] = useState<PathState>({
    ...getPath(),
    searchParams: {},
  });

  useEffect(() => {
    setState((old) => ({
      ...old,
      ...getPath(),
    }));
  }, [location.pathname]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const entities = searchParams.entries();
    const returnParams: SearchParams = {};

    for (const [key, value] of entities) {
      const param = returnParams[key];
      if (!param) {
        returnParams[key] = [value];
      } else {
        param.push(value);
      }
    }

    setState((old) => ({ ...old, searchParams: returnParams }));
  }, [location.search]);

  const setPath = (to: To, options?: NavigateOptions) => {
    if (location.pathname !== to) {
      if (typeof to === "string") {
        navigate(clearSlash(to), options);
      } else {
        if (location.key === "default") {
          navigate("/", options);
        } else {
          navigate(to, options);
        }
      }
    }
  };

  /** If you pass a string as the value parameter, the values ​​will be replaced. If you pass an array, the values ​​will be added.
   * Use once per useEffect*/
  const changeSearchParams = (searchParams: SearchParamsState) => {
    navigate({
      pathname: location.pathname,
      search: parseSearchParams(searchParams, location).toString(),
    });
  };
  const deleteSearchParams = (key: string) => {
    const params = new URLSearchParams(location.search);
    params.delete(key);
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };
  const clearSearchParams = () => {
    navigate({
      pathname: location.pathname,
      search: "",
    });
  };

  return (
    <Context.Provider
      value={{
        page: {
          path: state.pagePath,
          navigate: setPath as NavigateFunction,
          isHavePrevHistory: location.key !== "default",
        },

        /** you can make changes once per useEffect or by tracking "params" changes*/
        searchParams: {
          params: state.searchParams,
          change: changeSearchParams,
          delete: deleteSearchParams,
          clear: clearSearchParams,
        },
        defaultLocation: location,
      }}>
      {children}
    </Context.Provider>
  );
};

export * from "./type";
