import { fireBaseStorage } from "config/fireBase";
import { getDownloadURL, ref } from "firebase/storage";

export const getImgLinkFromFireBase = async (link: string) => {
  try {
    const linkRef = ref(fireBaseStorage, link);
    const url = await getDownloadURL(linkRef);
    return url;
  } catch (e) {
    console.log("Can't download photo: ", link, e);

    return "";
  }
};
