import { memo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Pagination,
  Snackbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { getAge } from "utils/getAge";
import { FallBack } from "components/FallBack";
import { useAuth, useProfiles } from "containers";
import css from "./style.module.scss";
import { deleteProfileFromServer } from "utils";

const maxProfilesPerPage = 20;

const Home = () => {
  const { profiles, setProfiles, loading } = useProfiles();
  const { user } = useAuth();
  const [isDel, setIsDel] = useState<{
    isOpen: boolean;
    severity: "success" | "error";
  }>({
    isOpen: false,
    severity: "success",
  });
  const [page, setPage] = useState(1);

  const removeProfile = async (id: string) => {
    const currentProfile = profiles[id];

    setProfiles((old) => {
      delete old[id];
      return { ...old };
    });

    const isSuccess = await deleteProfileFromServer(id,currentProfile );
    if (isSuccess)
      setIsDel({
        isOpen: true,
        severity: "success",
      });
    else
      setIsDel({
        isOpen: true,
        severity: "error",
      });
  };

  const changePage = (p: number) => {
    setPage(p);

    document.body.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  };

  const pagesAmount = Math.ceil(
    Object.values(profiles).length / maxProfilesPerPage,
  );

  return (
    <>
      <Snackbar
        open={isDel.isOpen}
        onClose={() => setIsDel((old) => ({ ...old, isOpen: false }))}
        autoHideDuration={2000}>
        <Alert variant="filled" severity={isDel.severity}>
          {isDel.severity === "success"
            ? "Successfully deleted!"
            : "Something went wrong"}
        </Alert>
      </Snackbar>

      <Pagination
        count={pagesAmount}
        page={page}
        onChange={(e, page) => changePage(page)}
      />
      <div className={css.root}>
        {Object.entries(profiles).map(
          ([id, { birthday = Infinity, name, photos }], i) => {
            const age = getAge(birthday);

            const avatar = photos[0];

            if (
              i < (page - 1) * maxProfilesPerPage ||
              i >= page * maxProfilesPerPage
            )
              return null;

            return (
              <Link
                to={{
                  pathname: `/profile/${id}`,
                }}
                className={css.link}>
                {user && (
                  <Button
                    className={css.close}
                    sx={{
                      background: "#93000a !important",
                      color: "white",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      padding: 0,
                      minWidth: 40,
                      minHeight: 40,
                      position: "absolute",
                      right: -8,
                      top: -8,
                      zIndex: 2,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      removeProfile(id);
                    }}>
                    <CloseIcon />
                  </Button>
                )}
                <Card
                  variant="elevation"
                  sx={{
                    height: "100%",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}>
                  <Typography
                    sx={{
                      fontSize: 24,
                      textAlign: "center",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textTransform: "capitalize",
                      lineHeight: 1.5,
                      whiteSpace: "nowrap",
                    }}>
                    {name}
                  </Typography>

                  <Typography sx={{ my: 0.5, lineHeight: 1 }}>
                    {age > 0 ? `Age: ${age}` : " "}
                  </Typography>

                  <img className={css.avatar} src={avatar} alt={name} />
                </Card>
              </Link>
            );
          },
        )}
      </div>
      <FallBack show={loading} />

      {!loading && pagesAmount > 1 && (
        <Pagination
          count={pagesAmount}
          page={page}
          onChange={(e, page) => changePage(page)}
        />
      )}
    </>
  );
};

export default Home;
