import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Popover,
  useTheme,
} from "@mui/material";

import { useAuth } from "containers/Providers";
import { usePath } from "hooks";

import { Routes } from "./routeComponents";
import { navigate, useAdminPopUp } from "./config";

const Layout = () => {
  const { page } = usePath();
  const { user } = useAuth();
  const theme = useTheme();
  const avatar = useRef<HTMLDivElement>(null);
  const { isOpen, handleClose, handleOpen, buttons } = useAdminPopUp();

  return (
    <>
      <Helmet>
        <title>Date</title>
      </Helmet>

      <Popover
        open={isOpen}
        onClose={handleClose}
        anchorEl={avatar.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          mt: 0.5,
        }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}>
          {buttons.map(({ onClick, text }) => (
            <Button
              sx={{
                py: 1,
                px: 2,
              }}
              onClick={onClick}>
              {text}
            </Button>
          ))}
        </Box>
      </Popover>

      <AppBar position="fixed">
        <Container maxWidth="lg" sx={{ mx: "auto" }}>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Box>
              {navigate.map(({ link, text }) => (
                <Button
                  onClick={() => page.navigate(link)}
                  sx={{
                    my: 0,
                    color: "white",
                    height: 50,
                    borderRadius: 0,
                    textTransform: "capitalize",
                  }}>
                  {text}
                </Button>
              ))}
            </Box>

            {user && (
              <Button onClick={handleOpen}>
                <Avatar
                  ref={avatar}
                  sx={{ width: 35, height: 35, bgcolor: "#0099ff" }}>
                  A
                </Avatar>
              </Button>
            )}
          </Box>
        </Container>
      </AppBar>
      <Container
        sx={{
          py: 2,
          minHeight: "100vh",
          mt: 5,
          bgcolor: theme.palette.secondary.main,
        }}
        maxWidth="lg">
        <Routes />
      </Container>
    </>
  );
};

export default Layout;
