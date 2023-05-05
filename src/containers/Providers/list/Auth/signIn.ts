import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from ".";

export const firebaseSighIn = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return credential.user;
};
