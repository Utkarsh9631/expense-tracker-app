// src/components/ScrollToHash.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    // small delay to ensure element exists (useful when route renders async)
    const id = hash ? hash.replace("#", "") : null;

    if (id) {
      // try to find the element
      const el = document.getElementById(id);
      if (el) {
        // scroll into view smoothly
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // element not on page yet -> try again shortly (rare)
        setTimeout(() => {
          const el2 = document.getElementById(id);
          if (el2) el2.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    } else {
      // no hash -> scroll to top for new pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // run whenever pathname or hash changes
  }, [hash, pathname]);

  return null;
}
