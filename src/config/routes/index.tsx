import { PagesRoute } from "./types";
import { lazyLoad } from "../utils";
export * from "./types";

const Home = lazyLoad(() => import("pages/Home"));
const _404 = lazyLoad(() => import("pages/_404"));

const Auth = lazyLoad(() => import("pages/Auth"));

const CreateProfile = lazyLoad(() => import("pages/CreateProfile"));

/**The key "data" means that the page configuration is located here. The rest of the keys are the path given the breadCrumbs */

export const routes: PagesRoute = {
  "/": {
    data: {
      component: Home,
    },
  },

  auth: {
    data: {
      component: Auth,
    },
  },

  create: {
    data: {
      component: CreateProfile,
      adminOnly: true,
    },
  },

  "*": {
    data: {
      component: _404,
    },
  },
};
