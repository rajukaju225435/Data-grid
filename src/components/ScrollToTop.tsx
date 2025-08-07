import React, { useState, useEffect } from "react";
import { FaArrowUp, FaTimes } from "react-icons/fa";
import { throttle } from "lodash";

const ScrollToTop: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(true);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setShowScrollTop(window.scrollY > 300);
    }, 200); 

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showScrollTop || !showScrollButton) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative group">
        <button
          onClick={scrollToTop}
          className="bg-black text-white p-3 rounded-full shadow-lg transition-opacity duration-100 hover:shadow-xl active:transform active:scale-95"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <FaArrowUp className="text-lg" />
          </div>
        </button>
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            setShowScrollButton(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowScrollButton(false);
            }
          }}
          className="absolute -top-2 -right-2 bg-white text-black rounded-full p-1 transition-colors duration-200 invisible group-hover:visible flex items-center justify-center cursor-pointer hover:bg-gray-100 w-5 h-5"
        >
          <FaTimes className="text-xs" />
        </div>
      </div>
    </div>
  );
};

export default ScrollToTop;
