import { createTheme, ThemeProvider as Provider } from "@mui/material";

import React, { FC } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#593196",
    },
    secondary: {
      main: "#ded6ea",
    },
    success: {
      main: "#13b955",
    },
    warning: {
      main: "#efa31d",
    },
    info: {
      main: "#00a1d7",
    },
    error: {
      main: "#93000a",
    },
  },
});

interface Props {
  children?: React.ReactNode;
}

export const ThemeProvider: FC<Props> = ({ children }) => {
  return <Provider theme={theme}>{children}</Provider>;
};
