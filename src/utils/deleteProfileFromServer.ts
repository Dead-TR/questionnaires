import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";

import { Profile } from "pages/CreateProfile/type";
import { fireBaseDataBase, fireBaseStorage } from "config/fireBase";

export const deleteProfileFromServer = async (id: string, profile: Profile) => {
  const deletedImgs = profile.photos;

  try {
    const refs = deletedImgs.map((link) => ref(fireBaseStorage, link));
    await Promise.all(refs.map((ref) => deleteObject(ref)));
    await deleteDoc(doc(fireBaseDataBase, "profiles", id));

    return true;
  } catch {
    return false;
  }
};
