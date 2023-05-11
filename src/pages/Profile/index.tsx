import { memo } from "react";

import css from "./style.module.scss";

const Home = () => {
  return <div className={css.root}>Profiles</div>;
};

export default memo(Home);
