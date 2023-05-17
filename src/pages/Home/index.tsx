import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Card, Pagination, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

import { getAge } from "utils/getAge";
import { FallBack } from "components/FallBack";
import { useAuth, useProfiles } from "containers";
import css from "./style.module.scss";
import { usePath } from "hooks";

const maxProfilesPerPage = 20;

const Home = () => {
  const { profiles, removeProfile, loading } = useProfiles();
  const { user } = useAuth();
  const { page: nav } = usePath();

  const [page, setPage] = useState(1);

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
                  <>
                    <Box
                      sx={{
                        position: "absolute",
                        right: -8,
                        top: -8,
                        zIndex: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}>
                      <Button
                        className={css.adminButton}
                        sx={{
                          background: "#93000a !important",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          removeProfile(id);
                        }}>
                        <CloseIcon />
                      </Button>

                      <Button
                        className={css.adminButton}
                        sx={{
                          background: "#00a1d7 !important",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          nav.navigate(`edit/${id}`);
                        }}>
                        <EditIcon />
                      </Button>
                    </Box>
                  </>
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
