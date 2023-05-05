import { useEffect } from "react";

export const useEventListener = <Event extends keyof DocumentEventMap>(
  event: Event,
  listener: (this: Document, ev: DocumentEventMap[Event]) => any,

  etc?: {
    options?: boolean | AddEventListenerOptions;
    element?: HTMLElement | Document;
    dependencies?: any[];
  },
) => {
  useEffect(() => {
    (etc?.element || document).addEventListener(
      event,
      listener as EventListenerOrEventListenerObject,
      etc?.options,
    );

    return () => {
      (etc?.element || document).removeEventListener(
        event,
        listener as EventListenerOrEventListenerObject,
        etc?.options,
      );
    };
  }, [etc?.dependencies]);
};
