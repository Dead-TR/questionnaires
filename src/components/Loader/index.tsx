import React, { FC, SVGProps } from "react";

import { ReactComponent as Loading } from "./loading.svg";

import css from "./style.module.scss";
import clsx from "clsx";

interface Props extends SVGProps<SVGSVGElement> {
  size?: string | number;
}
export const Loader: FC<Props> = ({ className, style, size, ...props }) => {
  return (
    <Loading
      {...props}
      className={clsx(className, css.loader)}
      style={{
        ...style,
        width: size,
        height: size,
      }}
    />
  );
};
