import React, { useState } from "react";

export function useIsDocumentVisible() {
  const [isVisible, setIsVisible] = useState(true);
  React.useEffect(() => {
    function handleVisibilityChange() {
      setIsVisible(!document.hidden);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
}
