import React, {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { collection, query, getDocs } from "firebase/firestore";

import { getImgLinkFromFireBase } from "utils/getImgLinkFromFireBase";
import { FrontProfile, ServerProfile } from "pages/CreateProfile/type";
import { fireBaseDataBase } from "config/fireBase";
import { deleteProfileFromServer } from "utils";
import { Alert, Snackbar } from "@mui/material";

type Profiles = Record<string, FrontProfile>;

const Context = createContext<{
  profiles: Profiles;
  setProfiles: Dispatch<SetStateAction<Record<string, FrontProfile>>>;
  removeProfile: (id: string) => Promise<boolean>;

  loading: boolean;
}>({
  profiles: {},
  setProfiles: () => {},
  removeProfile: async () => true,

  loading: false,
});

interface Props {
  children?: React.ReactNode;
}
export const ProfilesProvider: FC<Props> = ({ children }) => {
  const [profiles, setProfiles] = useState<Record<string, FrontProfile>>({});
  const [loading, setLoading] = useState(true);
  const [isDel, setIsDel] = useState<{
    isOpen: boolean;
    severity: "success" | "error";
  }>({
    isOpen: false,
    severity: "success",
  });

  useEffect(() => {
    const getProfiles = async () => {
      setLoading(true);
      try {
        const profilesRef = query(collection(fireBaseDataBase, "profiles"));
        const profiles = await getDocs(profilesRef);

        const list = await new Promise<Record<string, FrontProfile>>(
          (res, rej) => {
            const list: Record<string, FrontProfile> = {};
            const size = profiles.size;
            let i = 0;

            profiles.forEach(async (doc) => {
              const profile = doc.data() as ServerProfile;
              const id = doc.id;

              const preparedPhotos: FrontProfile["photos"] = [];

              for (const currentPhoto of profile.photos) {
                const { isAvatar, name } = currentPhoto;
                const link = await getImgLinkFromFireBase(currentPhoto.name);
                preparedPhotos.push({
                  isAvatar,
                  link,
                  name,
                });
              }

              list[id] = {
                ...profile,
                photos: preparedPhotos,
              };

              if (++i === size) res(list);
            });

            if (i === size) res(list);
          },
        );

        setProfiles(list);
      } catch (e) {
        console.error("Something went wrong", e);
      }
      setLoading(false);
    };
    getProfiles();
  }, []);

  const removeProfile = async (id: string) => {
    const currentProfile = profiles[id];

    setProfiles((old) => {
      delete old[id];
      return { ...old };
    });

    const isSuccess = await deleteProfileFromServer(id, currentProfile);
    if (isSuccess) {
      setIsDel({
        isOpen: true,
        severity: "success",
      });
      return true;
    } else {
      setIsDel({
        isOpen: true,
        severity: "error",
      });
      return false;
    }
  };

  return (
    <>
      <Context.Provider
        value={{ profiles, setProfiles, removeProfile, loading }}>
        {children}
      </Context.Provider>

      <Snackbar
        open={isDel.isOpen}
        onClose={() => setIsDel((old) => ({ ...old, isOpen: false }))}
        autoHideDuration={2000}>
        <Alert variant="filled" severity={isDel.severity}>
          {isDel.severity === "success"
            ? "Successfully deleted!"
            : "Something went wrong"}
        </Alert>
      </Snackbar>
    </>
  );
};

export const useProfiles = () => useContext(Context);
