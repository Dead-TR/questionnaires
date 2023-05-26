import React, { FC, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

import { Box, Button, Card, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { createTimeouts } from "utils";
import { useAuth } from "containers";
import { usePath } from "hooks";

import { getAge } from "utils/getAge";
import { FrontProfile } from "pages/CreateProfile/type";

import css from "./../style.module.scss";

interface Props extends FrontProfile {
  id: string;
  isFavorite: boolean;
  setFavorite: (id: string) => void;
  handleRemove: (id: string | number) => void;
}

export const ProfileCard: FC<Props> = ({
  birthday,
  children,
  city,
  country,
  etc,
  height,
  job,
  marital,
  name,
  photos,
  weight,
  id,
  isFavorite,
  setFavorite,
  handleRemove,
}) => {
  const { user } = useAuth();
  const { page: nav } = usePath();

  const [isHover, setIsHover] = useState(false);

  const age = useMemo(() => getAge(birthday), [birthday]);
  const avatar = useMemo(() => photos[0], [photos[0].name]);
  const { clearTimeouts, pushTimeout } = useMemo(() => createTimeouts(), []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [isHover]);

  const handleRotate = () => {
    clearTimeouts();
    setIsHover(true);
  };

  return (
    <Link
      to={{
        pathname: `/profile/${id}`,
      }}
      onPointerOver={handleRotate}
      onPointerLeave={() =>
        pushTimeout(() => setIsHover(false), +css.animationTime * 2)
      }
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleRotate();
      }}
      className={css.link}>
      {user && (
        <>
          <Box
            sx={{
              position: "absolute",
              left: -8,
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
                handleRemove(id);
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

      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setFavorite(id);
          }}
          className={css.adminButton}
          sx={{
            color: "red",
            transform: "scale(1) !important",
            opacity: 1 + "!important",
          }}>
          {isFavorite ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon color="error" />
          )}
        </Button>
      </Box>

      <Card
        variant="elevation"
        sx={{
          height: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          position: "relative",
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

        <div className={css.avatarBox}>
          <img
            className={clsx(css.avatar, isHover && css.avatarRotate)}
            src={avatar.link}
            alt={name}
          />

          <div className={clsx(css.content, isHover && css.contentRotate)}>
            <div className={css.data}>
              {weight && (
                <div>
                  weight: <span>{weight}kg</span>
                </div>
              )}

              {height && (
                <div>
                  height: <span>{height}cm</span>
                </div>
              )}

              {marital && (
                <div>
                  marital: <span>{marital}</span>
                </div>
              )}

              <div>
                children: <span>{children ? children : "no children"}</span>
              </div>

              {job && (
                <div>
                  job: <span>{job}</span>
                </div>
              )}

              {country && (
                <div>
                  country: <span>{country}</span>
                </div>
              )}

              {city && (
                <div>
                  city: <span>{city}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
