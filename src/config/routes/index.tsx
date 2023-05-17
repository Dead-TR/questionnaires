import { PagesRoute } from "./types";
import { lazyLoad } from "../utils";
export * from "./types";

const Home = lazyLoad(() => import("pages/Home"));
const Profile = lazyLoad(() => import("pages/Profile"));
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

  profile: {
    data: {
      redirect: "/",
    },

    "*": {
      data: {
        component: Profile,
      },
    },
  },

  edit: {
    data: {
      redirect: "/",
    },

    "*": {
      data: {
        component: CreateProfile,
        adminOnly: true,
      },
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
      // component: _404,
      redirect: "/",
    },
  },
};
