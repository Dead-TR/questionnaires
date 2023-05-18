import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import dateFormat from "dateformat";

import { usePath } from "hooks";
import { useProfiles } from "containers";

import { FallBack } from "components/FallBack";
import { getAge } from "utils/getAge";

import { Carousel } from "./components";
import css from "./style.module.scss";

const Profile = () => {
  const { page } = usePath();
  const { profiles, loading } = useProfiles();
  const [isOpenCarousel, setIsOpenCarousel] = useState(false);

  const breadCrumbs = page.path.split("/");
  const id = breadCrumbs[breadCrumbs.length - 1];

  useEffect(() => {
    if (loading || !profiles || !profiles.length) return;

    if (!profiles[id]) page.navigate("/");
  }, [profiles, loading]);

  const { name, birthday, photos, children, city, country, job, marital, etc } =
    profiles[id] || {};

  const isWithMainContent =
    birthday || marital || job || children || country || city;

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

          <Box
            sx={{
              display: "flex",
            }}>
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

                  {job ? (
                    <Box>
                      <Typography>Job:</Typography>
                      <Typography>{job}</Typography>
                    </Box>
                  ) : null}

                  {children ? (
                    <Box>
                      <Typography>Children:</Typography>
                      <Typography>{children}</Typography>
                    </Box>
                  ) : null}

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

              {etc ? <Typography>{etc}</Typography> : null}
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
    </>
  );
};

export default Profile;
