import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";

import { FrontProfile } from "pages/CreateProfile/type";
import { fireBaseDataBase, fireBaseStorage } from "config/fireBase";

export const deletePhotosFromServer = async (pathNames: string[]) => {
  const refs = pathNames.map((path) => ref(fireBaseStorage, path));
  return await Promise.all(refs.map((ref) => deleteObject(ref)));
};

export const deleteProfileFromServer = async (
  id: string,
  profile: FrontProfile,
) => {
  const deletedImgs = profile.photos;

  try {
    await deletePhotosFromServer(deletedImgs.map(({ name }) => name));
    await deleteDoc(doc(fireBaseDataBase, "profiles", id));

    return true;
  } catch {
    return false;
  }
};
