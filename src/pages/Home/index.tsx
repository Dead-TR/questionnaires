import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Container,
  Modal,
  Pagination,
  Typography,
} from "@mui/material";

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
  const [deleteUserId, setDeleteUserId] = useState<number | string | null>(
    null,
  );

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
              <Fragment key={`profile_${id}`}>
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
                          color="error"
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setDeleteUserId(id);
                          }}>
                          <CloseIcon />
                        </Button>

                        <Button
                          className={css.adminButton}
                          color="info"
                          variant="contained"
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

                    <img className={css.avatar} src={avatar.link} alt={name} />
                  </Card>
                </Link>
              </Fragment>
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

      <Modal
        open={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Container
          sx={{
            background: "white",
            display: "flex",
            flexDirection: "column",
            width: "fit-content",
            p: 2,
            borderRadius: 2,
          }}>
          <Typography
            sx={{
              mb: 4,
            }}>
            Are you sure you want to delete the profile?
          </Typography>
          <Box sx={{ mx: "auto" }}>
            <Button
              onClick={() => {
                removeProfile("" + deleteUserId);
                setDeleteUserId(null);
              }}>
              Yes
            </Button>
            <Button onClick={() => setDeleteUserId(null)}>No</Button>
          </Box>
        </Container>
      </Modal>
    </>
  );
};

export default Home;
