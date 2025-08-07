import { useEffect, useRef } from "react";

export const useIntersectionObserver = (
  onIntersect: () => void,
  condition: boolean
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && condition) {
          onIntersect(); 
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );

    if (loadingDivRef.current && observerRef.current) {
      observerRef.current.observe(loadingDivRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [condition]);

  return loadingDivRef;
};
