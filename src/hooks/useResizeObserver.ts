import { useCallback, useEffect, useRef } from "react";

interface ObserverOptions extends ResizeObserverOptions {
  disable: boolean;
}

export const useResizeObserver = (
  callBack: (entries: ResizeObserverEntry[]) => void,
  dependence: any[] = [],
  options?: ObserverOptions,
) => {
  const elementRef = useRef<HTMLElement | null>(null)
  const setNode = useCallback(
    (node: HTMLElement|undefined | null) => {
      if(node){
        elementRef.current = node
      }
          },
    [...dependence],
  )
  useEffect(() => {
    const { disable = false, ...opt } = options || {};
    if (!elementRef.current || disable) {
      return;
    }
    const resizeObserver = new ResizeObserver(callBack);
    resizeObserver.observe(elementRef.current, opt);

    return () => {
      elementRef.current && resizeObserver.unobserve(elementRef.current);
    };
  }, [setNode]);

  return {elementRef,setNode};
};
