import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import { fireBaseConfig } from "./config";

export const fireBaseApp = initializeApp(fireBaseConfig);
export const fireBaseAnalytics = getAnalytics(fireBaseApp);
export const fireBaseStorage = getStorage(fireBaseApp);
export const fireBaseDataBase = getFirestore(fireBaseApp);

/**Deploy:
 * firebase login
 * firebase init
 * firebase deploy
 */
