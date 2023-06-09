import { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import dateFormat from "dateformat";

import { usePath } from "hooks";
import { useAuth, useProfiles } from "containers";

import { FallBack } from "components/FallBack";
import { getAge } from "utils/getAge";

import { Carousel } from "./components";
import css from "./style.module.scss";
import { DeleteProfileConfirm } from "components/DeleteProfileConfirm";

const Profile = () => {
  const { page } = usePath();
  const { user } = useAuth();
  const { profiles, loading } = useProfiles();
  const [isOpenCarousel, setIsOpenCarousel] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(
    null,
  );

  const breadCrumbs = page.path.split("/");
  const id = breadCrumbs[breadCrumbs.length - 1];

  useEffect(() => {
    if (loading || !profiles || !profiles.length) return;

    if (!profiles[id]) page.navigate("/");
  }, [profiles, loading]);

  const {
    name,
    birthday,
    photos,
    children,
    city,
    country,
    job,
    marital,
    etc,
    height,
    weight,
  } = profiles[id] || {};

  const isWithMainContent =
    birthday ||
    marital ||
    job ||
    children ||
    country ||
    city ||
    height ||
    weight;

  return (
    <>
      <FallBack show={loading} />
      <div className={css.root}>
        <Container
          sx={{
            opacity: loading ? 0 : 1,
            transition: "opacity 0.3s",
          }}>
          <Typography sx={{ fontSize: 34, fontWeight: "bold", lineHeight: 1 }}>
            {name}
          </Typography>
          <Typography sx={{ fontSize: 18, marginBottom: 2 }}>
            {birthday ? `Age: ${getAge(birthday)}` : ""}
          </Typography>

          <Box className={css.profileBox}>
            <Box
              sx={{
                flexBasis: "100%",
              }}>
              <Box
                sx={{
                  position: "relative",
                  maxWidth: 400,
                  width: "100%",
                  cursor: "pointer",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
                onClick={() => setIsOpenCarousel(true)}>
                <img
                  src={photos ? photos[0].link || "" : ""}
                  alt={name}
                  className={css.avatar}
                />
                <div className={css.etcImg}>
                  {photos?.map(({ link }, i) => {
                    if (!i) return null;
                    return <img src={link} alt={"photo_" + i} />;
                  })}
                </div>
              </Box>
              {user ? (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 400,
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    mt: 1,
                  }}>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => setDeleteConfirm(id)}>
                    Delete Profile
                  </Button>
                  <Button
                    color="info"
                    variant="contained"
                    onClick={(e) => {
                      page.navigate(`edit/${id}`);
                    }}>
                    Edit Profile
                  </Button>
                </Box>
              ) : null}
            </Box>
            <Box className={css.data}>
              {isWithMainContent ? (
                <Box className={css.mainContent}>
                  {birthday ? (
                    <Box>
                      <Typography>Date of Birth:</Typography>
                      <Typography>
                        {dateFormat(birthday, "dd.mm.yyyy")}
                      </Typography>
                    </Box>
                  ) : null}

                  {marital ? (
                    <Box>
                      <Typography>Marital:</Typography>
                      <Typography>{marital}</Typography>
                    </Box>
                  ) : null}

                  {height ? (
                    <Box>
                      <Typography>Height:</Typography>
                      <Typography>{height}cm</Typography>
                    </Box>
                  ) : null}

                  {weight ? (
                    <Box>
                      <Typography>Weight:</Typography>
                      <Typography>{weight}kg</Typography>
                    </Box>
                  ) : null}

                  {job ? (
                    <Box>
                      <Typography>Job:</Typography>
                      <Typography>{job}</Typography>
                    </Box>
                  ) : null}

                  <Box>
                    <Typography>Children:</Typography>
                    <Typography>
                      {children ? children : "No children"}
                    </Typography>
                  </Box>

                  {country ? (
                    <Box>
                      <Typography>Country:</Typography>
                      <Typography>{country}</Typography>
                    </Box>
                  ) : null}

                  {city ? (
                    <Box>
                      <Typography>City:</Typography>
                      <Typography>{city}</Typography>
                    </Box>
                  ) : null}
                </Box>
              ) : null}

              {etc ? (
                <Typography
                  sx={{
                    whiteSpace: "pre-wrap",
                  }}>
                  {etc}
                </Typography>
              ) : null}
            </Box>
          </Box>
        </Container>
      </div>

      {isOpenCarousel && (
        <Carousel
          isOpen={isOpenCarousel}
          handleClose={() => setIsOpenCarousel(false)}
          pictures={photos.map(({ link }) => link)}
        />
      )}

      <DeleteProfileConfirm
        profileId={deleteConfirm}
        setProfileId={setDeleteConfirm}
      />
    </>
  );
};

export default Profile;
