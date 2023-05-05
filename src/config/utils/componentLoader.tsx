import React from "react";

const carefulLoader = (
  lazyComponent: Promise<any>,
  attemptsLeft = 5,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    lazyComponent
      .then((module) => {
        if (module.default) {
          resolve(module);
        } else {
          for (let moduleName in module) {
            resolve({ default: module[moduleName] });
          }
        }
      })
      .catch((error) => {
        setTimeout(() => {
          if (attemptsLeft === 1) {
            reject(error);

            return;
          }
          carefulLoader(lazyComponent, attemptsLeft - 1).then(resolve, reject);
        }, 500);
      });
  });
};

export const lazyLoad = <G extends any>(importComponent: () => Promise<G>) =>
  React.lazy(() => carefulLoader(importComponent()));

export default lazyLoad;
