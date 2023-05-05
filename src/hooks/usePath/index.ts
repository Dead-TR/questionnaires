import { useContext } from "react";
import Context from "./provider/context";

export const usePath = () => {
  return useContext(Context);
};

export * from "./provider";
export * from "./type";
