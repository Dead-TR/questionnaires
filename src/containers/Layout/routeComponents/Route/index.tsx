import { Suspense } from "react";
import { Routes as Switch, Route, Navigate } from "react-router-dom";

import { createRoute } from "config";
import { usePath } from "hooks";
import { useAuth } from "containers/Providers";

const { pages } = createRoute();
console.log("🚀 ~ file: index.tsx:9 ~ pages:", pages);

export const Routes = () => {
  const { page } = usePath();
  const { user } = useAuth();

  return (
    <>
      <Suspense>
        <Switch location={page.path}>
          {pages.map(({ pathName, data }, i) => {
            const { component: Component, redirect, adminOnly } = data;

            const isRedirect = !Component || redirect || (!user && !!adminOnly);

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
