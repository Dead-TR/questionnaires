import { memo, useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import clsx from "clsx";
import { Alert, Box, Button, Card, Container, Snackbar } from "@mui/material";
import { UploadResult, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { fromBlob } from "image-resize-compress";

import { getImgLinkFromFireBase } from "utils/getImgLinkFromFireBase";
import { fireBaseDataBase, fireBaseStorage } from "config/fireBase";
import { deletePhotosFromServer, sleep } from "utils";
import { Loader } from "components/Loader";
import { useProfiles } from "containers";
import { usePath } from "hooks";

import { TextFields } from "./components";
import { FrontProfile, PhotosState, ProfileState, ServerProfile } from "./type";
import css from "./style.module.scss";

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
  console.log("🚀 ~ file: index.tsx:38 ~ CreateProfile ~ photos:", photos);
  const [deletedPhotos, setDeletedPhotos] = useState<string[]>([]);
  const [state, setState] = useState<ProfileState>({
    name: "",
    birthday: 0,
    children: 0,
    marital: "",
    job: "",
    country: "",
    city: "",
    height: "",
    weight: "",

    etc: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkIsEditor, setCheckIsEditor] = useState(false);

  const [error, setError] = useState("");

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
      height: "",
      weight: "",
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

        const result = await setDoc(
          doc(fireBaseDataBase, "profiles", ID.current),
          newServerProfile,
        );

        console.log(result, serverProfilePhotos);

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
          setError("Photos list is empty");
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
      setError("Error: " + (error as Error).message);
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
        height = "",
        weight = "",
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
          height,
          weight,
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
            onDrop={async (acceptedFiles) => {
              const photos = await Promise.all(
                acceptedFiles.map(async (file, i) => {
                  const compressedFile = await fromBlob(
                    file,
                    90,
                    "auto",
                    900,
                    "webp",
                  );
                  const preparedFile =
                    compressedFile.size < file.size
                      ? new File([compressedFile], `${i}.webp`, {
                          type: "image/webp",
                        })
                      : file;

                  console.log("🚀 ~ ~> ", preparedFile);
                  return {
                    file: preparedFile,
                    link: URL.createObjectURL(preparedFile),
                  };
                }),
              );

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
          {loading ? <Loader size={25} /> : <span>Send</span>}
        </Button>
      </Container>

      <Snackbar
        open={isSuccess || !!error}
        autoHideDuration={2000}
        onClose={() => {
          setError("");
          setIsSuccess(false);
        }}>
        <Alert icon={false} severity={!error ? "info" : "error"}>
          {!error ? (
            <Box>
              <span className={css.subTitle}>Profile created!</span>
              <h1 className={css.name}>{oldData.current.name}</h1>
              <img
                src={oldData.current.photo}
                alt="avatar"
                className={css.helpAvatar}
              />
            </Box>
          ) : (
            error
          )}
        </Alert>
      </Snackbar>
    </>
  );
};

export default memo(CreateProfile);
