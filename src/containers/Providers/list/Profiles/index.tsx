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

type Profiles = Record<string, Profile>;

const Context = createContext<{
  profiles: Profiles;
  setProfiles: Dispatch<SetStateAction<Record<string, Profile>>>;

  loading: boolean;
}>({
  profiles: {},
  setProfiles: () => {},

  loading: false,
});

interface Props {
  children?: React.ReactNode;
}
export const ProfilesProvider: FC<Props> = ({ children }) => {
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);

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

          list[id] = { ...profile, photos: updatedLinks };

          if (++i === size) res(list);
        });
      });

      setProfiles(list);
      setLoading(false);
    };

    getProfiles();
  }, []);

  return (
    <Context.Provider value={{ profiles, setProfiles, loading }}>
      {children}
    </Context.Provider>
  );
};

export const useProfiles = () => useContext(Context);
