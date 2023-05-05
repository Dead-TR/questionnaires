import { Location, NavigateFunction } from "react-router-dom";
import { SearchParams, SearchParamsState } from "../type";

export interface PathContextType {
  page: {
    path: string;
    navigate: NavigateFunction;
    isHavePrevHistory: boolean;
  };

  searchParams: {
    params: SearchParams;
    change: (searchParams: SearchParamsState) => void;
    delete: (key: string) => void;
    clear: () => void;
  };

  defaultLocation: Location;
}
