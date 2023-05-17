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
import { Profile } from "pages/CreateProfile/type";
import { fireBaseDataBase } from "config/fireBase";
import { deleteProfileFromServer } from "utils";
import { Alert, Snackbar } from "@mui/material";

type Profiles = Record<string, Profile>;

const Context = createContext<{
  profiles: Profiles;
  setProfiles: Dispatch<SetStateAction<Record<string, Profile>>>;
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
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
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
      const profilesRef = query(collection(fireBaseDataBase, "profiles"));
      const profiles = await getDocs(profilesRef);

      const list = await new Promise<Record<string, Profile>>((res, rej) => {
        const list: Record<string, Profile> = {};
        const size = profiles.size;
        let i = 0;

        profiles.forEach(async (doc) => {
          const profile = doc.data() as Profile;
          const id = doc.id;

          const updatedLinks: string[] = [];

          for (const link of profile.photos) {
            const img = await getImgLinkFromFireBase(link);
            updatedLinks.push(img);
          }

          list[id] = {
            ...profile,
            photos: updatedLinks,
            photoRefs: profile.photos,
          };

          if (++i === size) res(list);
        });
      });

      setProfiles(list);
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
