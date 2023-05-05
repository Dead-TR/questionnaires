import {
  forwardRef,
  ForwardRefExoticComponent,
  lazy,
  SVGProps,
  cloneElement,
  DetailedHTMLProps,
  ImgHTMLAttributes,
  Suspense,
  ReactNode,
  FC,
} from "react";

import { sleep } from "utils";

export type ImgProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export type ImgLoader = ForwardRefExoticComponent<ImgProps>;
export type SvgLoader = ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;
export type SVGImportCallback = () => Promise<typeof import("*.svg")>;
const svgLoader = (
  callBack: SVGImportCallback,
  asImg = false,
  triesCount = 3,
) => {
  const retry = async () => {
    await sleep(0.5);
    svgLoader(callBack, asImg, triesCount - 1);
  };
  return new Promise(async (resolve, reject) => {
    try {
      const { default: path } = await callBack();

      if (asImg) {
        const Component = forwardRef<HTMLImageElement, ImgProps>(
          (props, ref) => (
            <img src={path} alt={props.alt} ref={ref} {...props} />
          ),
        );

        const result = {
          default: Component,
        };

        resolve(result);
      }

      const { default: parse } = await import("html-react-parser");
      const svgText = await (await (await fetch(path)).blob()).text();

      let Element = parse(svgText);

      if (Array.isArray(Element)) {
        Element = Element[0];
      }

      const Component = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
        (props, ref) => {
          return (
            <>
              {cloneElement(Element as any, {
                ...props,
                ref,
              })}
            </>
          );
        },
      );

      const result = {
        default: Component,
      };

      resolve(result);
    } catch (error) {
      console.error(error);

      if (triesCount <= 1) {
        reject();
      } else retry();
    }
  });
};

type SvgProps = SVGProps<SVGSVGElement> & { fallback?: ReactNode };
export type ImgPropsWithFallback = ImgProps & { fallback?: ReactNode };

/**with Suspense */
export function svgLazyLoad(
  importCallBack: SVGImportCallback,

  asImg: true,
): FC<ImgPropsWithFallback>;
export function svgLazyLoad(
  importCallBack: SVGImportCallback,
  asImg?: false,
): FC<SvgProps>;

export function svgLazyLoad(
  importCallBack: SVGImportCallback,
  asImg?: boolean,
): FC<any> {
  const Component = lazy(() => svgLoader(importCallBack, asImg) as any);
  return ({ fallback, ...props }) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}
