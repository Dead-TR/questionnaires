import { Fragment, useState } from "react";
import {
  Box,
  Button,
  Container,
  Modal,
  Pagination,
  Typography,
} from "@mui/material";

import { useProfiles } from "containers";
import { getAge } from "utils/getAge";
import { FallBack } from "components/FallBack";

import css from "./style.module.scss";
import { ProfileCard } from "./Card";

const maxProfilesPerPage = 20;

const Home = () => {
  const { profiles, removeProfile, loading } = useProfiles();

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
          ([id, { birthday = Infinity, photos, ...etc }], i) => {
            if (
              i < (page - 1) * maxProfilesPerPage ||
              i >= page * maxProfilesPerPage
            )
              return null;

            return (
              <Fragment key={`profile_${id}`}>
                <ProfileCard
                  {...{
                    birthday,
                    photos,
                    ...etc,
                    id,
                    handleRemove: setDeleteUserId,
                  }}
                />
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
