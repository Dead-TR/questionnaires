import { signOut } from "firebase/auth";
import { auth } from ".";

export const fireBaseSightOut = async () => {
  await signOut(auth);

  return true;
};
