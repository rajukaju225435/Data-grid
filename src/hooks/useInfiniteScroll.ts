import { useEffect, useRef, useState } from "react";
import throttle from "lodash/throttle";
export const useInfiniteScroll = (
  displayedSections: any[],
  groupedItems: any[],
  setDisplayedSections: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingDivRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!loadingDivRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const loadMore = () => {
      if (!isLoadingMore && displayedSections.length < groupedItems.length) {
        setIsLoadingMore(true);

        setTimeout(() => {
          setDisplayedSections((prev) => [
            ...prev,
            ...groupedItems.slice(prev.length, prev.length + 1),
          ]);
          setIsLoadingMore(false);
        }, 300);
      }
    };

    const throttledLoadMore = throttle(loadMore, 500, { trailing: true });

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          throttledLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(loadingDivRef.current);

    return () => {
      observerRef.current?.disconnect();
      throttledLoadMore.cancel();
    };
  }, [displayedSections.length, groupedItems.length, isLoadingMore]);

  return { isLoadingMore, loadingDivRef };
};
