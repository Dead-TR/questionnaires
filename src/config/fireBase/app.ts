import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { fireBaseConfig } from "./config";

export const fireBaseApp = initializeApp(fireBaseConfig);
export const fireBaseAnalytics = getAnalytics(fireBaseApp);

/**Deploy:
 * firebase login
 * firebase init
 * firebase deploy
 */