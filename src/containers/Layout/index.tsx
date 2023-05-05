import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

import { AppBar, Avatar, Box, Button, Container, Popover } from "@mui/material";

import { useAuth } from "containers/Providers";
import { usePath } from "hooks";

import { Routes } from "./routeComponents";

const Layout = () => {
  const { page } = usePath();
  const { user, sightOut } = useAuth();
  const avatar = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Helmet>
        <title>Projects</title>
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
        <Box>
          <Button
            sx={{
              py: 1,
              px: 2,
            }}
            onClick={() => {
              sightOut();
              handleClose();
            }}>
            Log Out
          </Button>
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
            <Button
              onClick={() => page.navigate("/")}
              sx={{
                my: 0,
                color: "white",
                height: 50,
                borderRadius: 0,
                textTransform: "capitalize",
              }}>
              Home
            </Button>

            {user && (
              <Button onClick={() => setIsOpen(true)}>
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
        sx={{ py: 2, minHeight: "100vh", mt: 5, bgcolor: "#cfe8fc" }}
        maxWidth="lg">
        <Routes />
      </Container>
    </>
  );
};

export default Layout;
