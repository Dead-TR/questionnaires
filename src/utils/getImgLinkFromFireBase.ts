import { fireBaseStorage } from "config/fireBase";
import { getDownloadURL, ref } from "firebase/storage";

export const getImgLinkFromFireBase = async (link: string) => {
  const linkRef = ref(fireBaseStorage, link);
  const url = await getDownloadURL(linkRef);

  return url;
};
