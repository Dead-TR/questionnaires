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
import { FrontProfile, PhotosState, ProfileState, ServerProfile } from "./type";
import css from "./style.module.scss";
import { getImgLinkFromFireBase } from "utils/getImgLinkFromFireBase";
import { usePath } from "hooks";
import { deletePhotosFromServer, sleep } from "utils";

const getFileTypeReg = /\.[0-9a-z]+$/i;

const CreateProfile = () => {
  const dragCard = useRef<HTMLDivElement>(null);

  const { page } = usePath();
  const [pageName, currentId] = page.path.substring(1).split("/");
  const isEditor = pageName === "edit";

  const { setProfiles, profiles, loading: isLoad } = useProfiles();

  const ID = useRef("0");

  const oldData = useRef({
    name: "",
    photo: "",
  });
  const [photos, setPhotos] = useState<PhotosState[]>([]);
  const [deletedPhotos, setDeletedPhotos] = useState<string[]>([]);
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
  const [checkIsEditor, setCheckIsEditor] = useState(false);

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
    setDeletedPhotos([]);
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
        const sendPhotos = photos.filter((p) => !!p.file); //do NOT send items for which there is no blob
        const imgRefs = sendPhotos.map((photo, i) => {
          const fileFormat = photo.file!.name.match(getFileTypeReg); //! -- because filter
          if (!fileFormat) return null;

          const imgName = `${ID.current}/${i}${fileFormat[0]}`;
          return {
            ref: ref(fireBaseStorage, imgName),
            name: imgName,
          };
        });

        const uploadResults = await Promise.all<UploadResult | null>(
          imgRefs.map((element, i) => {
            if (!element) return new Promise((r) => r(null));

            const photo = photos[i];

            return uploadBytes(element.ref, photo.file as File); //! -- because filter
          }),
        );

        const serverProfilePhotos = [
          ...photos
            .filter((p) => !p.file && p.name)
            .map(({ name = "" }) => ({ name, isAvatar: false })),
          ...uploadResults.map((r) => ({
            isAvatar: false,
            name: r?.metadata.fullPath || "",
          })),
        ].map(({ name }, i) => ({
          isAvatar: i === 0,
          name,
        }));

        const newServerProfile: ServerProfile = {
          ...state,
          photos: serverProfilePhotos,
        };

        await setDoc(
          doc(fireBaseDataBase, "profiles", ID.current),
          newServerProfile,
        );

        const links = await Promise.all(
          serverProfilePhotos.map(async (v) => {
            const pathName = v.name || "";
            const link = await getImgLinkFromFireBase(pathName);

            return {
              link,
              name: pathName,
            };
          }),
        );

        if (!links) {
          throw new Error(`cant send Photos: ${JSON.stringify(links)}`);
        }

        const newFrontProfile: FrontProfile = {
          ...state,
          photos: links.map(({ link, name }, i) => ({
            isAvatar: i === 0,
            name,
            link,
          })),
        };

        setProfiles((old) => ({
          ...old,
          [ID.current]: newFrontProfile,
        }));

        deletePhotosFromServer(deletedPhotos);
      }

      handleClear();
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);

    if (isEditor) {
      page.navigate("/");
    }
  };

  useEffect(() => {
    ID.current = currentId || ("" + Date.now()).substring(4);
    const currentProfile = profiles[currentId];

    if (isEditor) {
      if (!(!isLoad && currentProfile)) return;

      const {
        name = "",
        birthday = 0,
        children = 0,
        city = "",
        country = "",
        job = "",
        marital = "",
        photos = [],
        etc = "",
      } = currentProfile;

      const prepareEditor = async () => {
        setPhotos(
          photos
            .sort((a, b) => {
              if (a.isAvatar) return -1;
              if (b.isAvatar) return 1;
              else return 0;
            })
            .map(({ link, name }) => ({ link, name })),
        );
        setState({
          name,
          birthday,
          children,
          marital,
          job,
          city,
          country,
          etc,
        });

        await sleep(0);
        setCheckIsEditor(true);
      };

      prepareEditor();
    } else {
      setCheckIsEditor(true);
      handleClear();
    }
  }, [page, isLoad]);

  return (
    <>
      <Container
        sx={{
          py: 5,
          overflow: "auto",
        }}
        className={clsx(loading && css.load, css.root)}>
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

                    if (isEditor) setDeletedPhotos((old) => [...old, v.link]);
                  }}
                />
              );
            })}
          </div>
        </Box>

        {checkIsEditor ? <TextFields {...{ state, setState }} /> : null}

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
