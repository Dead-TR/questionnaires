import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useAuth } from "containers/Providers";
import { usePath } from "hooks";

import css from "./style.module.scss";
import { Loader } from "components/Loader";

const Auth = () => {
  const { sighIn, user } = useAuth();
  const { page } = usePath();

  const [state, setState] = useState({
    email: "",
    password: "",
    isShowPass: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) page.navigate("/");
  }, [user]);

  return (
    <Container sx={{}}>
      <Box sx={{ maxWidth: 400, m: "auto", width: "100%", mt: 10 }}>
        <Paper sx={{ p: 4 }} elevation={3}>
          <TextField
            label="Login"
            type="text"
            sx={{ width: "100%" }}
            value={state.email}
            onChange={({ target }) =>
              setState((old) => ({ ...old, email: target.value }))
            }
          />
          <div className={css.inputWrapper}>
            <TextField
              label="Password"
              sx={{ width: "100%", mt: 2 }}
              onChange={({ target }) =>
                setState((old) => ({ ...old, password: target.value }))
              }
              type={state.isShowPass ? "text" : "password"}
            />
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                setState((old) => ({
                  ...old,
                  isShowPass: !old.isShowPass,
                }));
              }}
              className={css.icon}
              edge="end">
              {state.isShowPass ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </div>

          <Button
            disabled={loading}
            variant="contained"
            sx={{ width: "100%", mt: 2, p: 1.5 }}
            onClick={async () => {
              setLoading(true);
              await sighIn(state.email, state.password);
              setLoading(false);
            }}>
            {loading ? <Loader size={25} /> : <span>Log In</span>}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth;
