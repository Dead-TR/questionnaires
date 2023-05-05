import { FC } from "react";

import css from "./style.module.scss";

export interface ErrorProps {
  title: string;
  message: string;
  stack?: string;
  cause?: string;
}

const ErrorPage: FC<ErrorProps> = ({ message, title, cause, stack }) => {
  return (
    <div className={css.wrapper}>
      <h1>{title}</h1>
      <p>Error reason: {message}</p>

      <div className={css.stack}>
        <span>{cause}</span>
        <span>{stack}</span>
      </div>

      <button onClick={() => window.location.reload()} className={css.button}>
        Reload Page
      </button>
    </div>
  );
};

export default ErrorPage;
