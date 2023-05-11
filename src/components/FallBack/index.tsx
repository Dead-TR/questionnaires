import React, { FC } from "react";
import { Loader } from "components/Loader";
import css from "./style.module.scss";

interface Props {
  show: boolean;
}

export const FallBack: FC<Props> = ({ show }) => {
  if (!show) return null;

  return (
    <div className={css.fallBack}>
      <Loader size={250} />
    </div>
  );
};
