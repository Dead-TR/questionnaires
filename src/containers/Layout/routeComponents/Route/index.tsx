import { Suspense } from "react";
import { Routes as Switch, Route, Navigate } from "react-router-dom";

import { createRoute } from "config";
import { usePath } from "hooks";

const { pages } = createRoute();

export const Routes = () => {
  const { page } = usePath();

  return (
    <>
      <Suspense>
        <Switch location={page.path}>
          {pages.map(({ pathName, data }, i) => {
            const { component: Component, redirect } = data;

            const isRedirect = !Component || redirect;

            return (
              <Route
                key={`routes/${pathName}_${i}`}
                path={pathName}
                element={
                  !isRedirect ? (
                    <Component />
                  ) : (
                    <Navigate to={redirect || "/"} />
                  )
                }
              />
            );
          })}
        </Switch>
      </Suspense>
    </>
  );
};
