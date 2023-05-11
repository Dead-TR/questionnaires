import { memo, useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import clsx from "clsx";
import { Alert, Box, Button, Card, Container, Snackbar } from "@mui/material";
import { UploadResult, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import { fireBaseDataBase, fireBaseStorage } from "config/fireBase";
import { Loader } from "components/Loader";
import { useProfiles } from "containers";

import { TextFields } from "./components";
import { PhotosState, Profile, ProfileState } from "./type";
import css from "./style.module.scss";
import { getImgLinkFromFireBase } from "utils/getImgLinkFromFireBase";

const getFileTypeReg = /\.[0-9a-z]+$/i;

const CreateProfile = () => {
  const dragCard = useRef<HTMLDivElement>(null);
  const { setProfiles } = useProfiles();

  const ID = useRef("0");
  const oldData = useRef({
    name: "",
    photo: "",
  });
  const [photos, setPhotos] = useState<PhotosState[]>([]);
  const [state, setState] = useState<ProfileState>({
    name: "",
    birthday: 0,
    children: 0,
    marital: "",
    job: "",
    country: "",
    city: "",

    etc: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggle = (add: boolean) => {
    if (!dragCard.current) return;
    const { classList } = dragCard.current;

    if (add) classList.add(css.activeCard);
    else classList.remove(css.activeCard);
  };

  const handleClear = () => {
    oldData.current = {
      name: state.name,
      photo: photos[0]?.link,
    };

    setPhotos([]);
    setState({
      name: "",
      birthday: 0,
      children: 0,
      marital: "",
      job: "",
      country: "",
      city: "",
      etc: "",
    });
    ID.current = ("" + Date.now()).substring(4);
  };

  const sendData = async () => {
    setLoading(true);
    try {
      if (photos.length) {
        const imgRefs = photos.map((photo, i) => {
          const fileFormat = photo.file.name.match(getFileTypeReg);
          if (!fileFormat) return null;

          const imgName = `${ID.current}/${i}${fileFormat[0]}`;
          return {
            ref: ref(fireBaseStorage, imgName),
            name: imgName,
          };
        });

        const result = await Promise.all<UploadResult | null>(
          imgRefs.map((element, i) => {
            if (!element) return new Promise((r) => r(null));

            const photo = photos[i];

            return uploadBytes(element.ref, photo.file);
          }),
        );

        const links = await Promise.all(
          result.map(async (v) => {
            return await getImgLinkFromFireBase(v?.metadata.fullPath || "");
          }),
        );

        if (!links) {
          throw new Error(`cant send Photos: ${JSON.stringify(links)}`);
        }

        const newProfile: Profile = {
          ...state,
          photos: links as string[],
        };

        await setDoc(doc(fireBaseDataBase, "profiles", ID.current), newProfile);

        setProfiles((old) => ({
          ...old,
          [ID.current]: newProfile,
        }));
      }

      handleClear();
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    ID.current = ("" + Date.now()).substring(4);
  }, []);

  return (
    <>
      <Container
        sx={{
          py: 5,
          overflow: "auto",
        }}
        className={clsx(loading && css.load)}>
        <Box sx={{ mx: "auto", maxWidth: 550 }}>
          <Dropzone
            onDrop={(acceptedFiles) => {
              const photos = acceptedFiles.map((file) => ({
                file,
                link: URL.createObjectURL(file),
              }));
              setPhotos((old) => [...old, ...photos]);
            }}
            onDragOver={() => toggle(true)}
            onDragLeave={() => toggle(false)}>
            {({ getRootProps, getInputProps }) => {
              const props = getRootProps();

              return (
                <Card
                  variant="outlined"
                  sx={{ p: 5 }}
                  {...props}
                  ref={dragCard}>
                  <input {...getInputProps()} />
                  <p className={css.text}>Add Photos</p>
                </Card>
              );
            }}
          </Dropzone>
        </Box>

        <Box sx={{ my: 4 }}>
          <div className={css.imgWrapper}>
            {photos.map((v, i) => {
              return (
                <img
                  src={v.link}
                  alt={"" + i}
                  className={clsx(i === 0 && css.avatar)}
                  loading="lazy"
                  onClick={() => {
                    const updatePhotos = photos.sort((a, b) =>
                      a.link === v.link ? -1 : b.link === v.link ? 1 : 0,
                    );
                    setPhotos([...updatePhotos]);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    const updatePhotos = photos.filter((img) => img !== v);
                    setPhotos(updatePhotos);
                  }}
                />
              );
            })}
          </div>
        </Box>

        <TextFields {...{ state, setState }} />

        <Button
          sx={{
            m: "0 auto",
            display: "block",
            minWidth: 200,
            p: 1.5,
          }}
          variant="contained"
          disabled={loading || !state.name || !photos.length}
          onClick={sendData}>
          {loading ? <Loader size={25} /> : "Send"}
        </Button>
      </Container>

      <Snackbar
        open={isSuccess}
        autoHideDuration={2000}
        onClose={() => setIsSuccess(false)}>
        <Alert icon={false} severity="info">
          <Box>
            <span className={css.subTitle}>Profile created!</span>
            <h1 className={css.name}>{oldData.current.name}</h1>
            <img
              src={oldData.current.photo}
              alt="avatar"
              className={css.helpAvatar}
            />
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
};

export default memo(CreateProfile);
