import React, { FC, useEffect, useRef, useState } from "react";
import { Box, Button, Modal } from "@mui/material";

import {
  Swiper as SwiperComponent,
  SwiperRef,
  SwiperSlide,
} from "swiper/react";
import Swiper, {
  EffectCreative,
  FreeMode,
  Navigation,
  Thumbs,
  Keyboard,
} from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import css from "./style.module.scss";
import clsx from "clsx";
import { Close } from "@mui/icons-material";

interface Props {
  isOpen: boolean;
  handleClose: () => void;

  pictures: string[];
}
export const Carousel: FC<Props> = ({ isOpen, handleClose, pictures }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<Swiper | null>(null);

  return (
    <Modal
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      open={isOpen}
      onClose={handleClose}>
      <Box
        className={css.box}
        sx={{
          background: "#5a5a5a",
          position: "relative",
          outline: "none",
        }}>
        <Button
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 2,
          }}
          onClick={handleClose}>
          <Close />
        </Button>

        <SwiperComponent
          className={css.swiper}
          grabCursor={true}
          navigation={true}
          keyboard={{
            enabled: true,
          }}
          effect={"creative"}
          creativeEffect={{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          }}
          modules={[EffectCreative, FreeMode, Navigation, Thumbs, Keyboard]}
          thumbs={{
            swiper: thumbsSwiper,
            slideThumbActiveClass: css.active,
          }}>
          {pictures?.map((link, i) => (
            <SwiperSlide className={css.slide}>
              <img src={link} alt={"photo#" + i} className={css.img} />
            </SwiperSlide>
          ))}
        </SwiperComponent>

        <SwiperComponent
          onSwiper={setThumbsSwiper}
          loop={false}
          spaceBetween={2}
          slidesPerView={10}
          freeMode={true}
          className={css.swipes}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}>
          {pictures?.map((link, i) => (
            <SwiperSlide className={css.thumbWrapper}>
              <img
                src={link}
                alt={"photo#" + i}
                className={clsx(css.thumbImg)}
              />
            </SwiperSlide>
          ))}
        </SwiperComponent>
      </Box>
    </Modal>
  );
};
