import { usePath } from "hooks";
import css from "./style.module.scss";
import { useProfiles } from "containers";
import { useEffect, useState } from "react";
import { FallBack } from "components/FallBack";
import { Box, Container, Typography } from "@mui/material";
import { getAge } from "utils/getAge";
import { Carousel } from "./components";

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

  return (
    <>
      <FallBack show={loading} />
      <div className={css.root}>
        <Container>
          <Box>
            <Typography
              sx={{ fontSize: 34, fontWeight: "bold", lineHeight: 1 }}>
              {name}
            </Typography>
            <Typography sx={{ fontSize: 18, marginBottom: 2 }}>
              {birthday ? `Age: ${getAge(birthday)}` : ""}
            </Typography>

            <Box
              sx={{
                position: "relative",
                maxWidth: 400,
                cursor: "pointer",
                borderRadius: 2,
                overflow: "hidden",
              }}
              onClick={() => setIsOpenCarousel(true)}>
              <img
                src={photos ? photos[0] || "" : ""}
                alt={name}
                className={css.avatar}
              />
              <div className={css.etcImg}>
                {photos?.map((link, i) => {
                  if (!i) return null;
                  return <img src={link} alt={"photo_" + i} />;
                })}
              </div>
            </Box>
          </Box>
          <Box></Box>
        </Container>
      </div>

      {isOpenCarousel && (
        <Carousel
          isOpen={isOpenCarousel}
          handleClose={() => setIsOpenCarousel(false)}
          pictures={photos}
        />
      )}
    </>
  );
};

export default Profile;
