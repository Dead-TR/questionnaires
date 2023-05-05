import React, { ReactNode, Suspense, SVGProps } from "react";
import { ImgProps, SVGImportCallback, svgLazyLoad } from ".";
type IProps = {
  //   callBack: SVGImportCallback;
  callBackPath: string;
};

type A = IProps & {
  type: "ReactComponent";
  props: SVGProps<SVGSVGElement> & { fallback?: ReactNode };
};
type B = IProps & { type: "img"; props: ImgProps };
type Props = A | B;
export const SVGLazyLoadComponent = ({ callBackPath, type, props }: Props) => {
  //   if (type === "img") {
  //     const ImageComponent = svgLazyLoad(() => import(`${callBackPath}`), true);
  //     return <ImageComponent {...(props as any)} />;
  //   } else {
  //     const { fallback, ...svgProps } = props;
  //     const SvgComponent = svgLazyLoad(() => import(`${callBackPath}`), true);
  //     return (
  //       <Suspense fallback={fallback || null}>
  //         <SvgComponent {...(svgProps as any)} />
  //       </Suspense>
  //     );
  //   }
};
