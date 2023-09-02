import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      //! if we do not prevent events from bubbling up- the modal will be opened and immediately closed
      //! because the events will bubble up so it will be attached outside the modal as well so it will closes
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    }

    // ? as a third argument we give to both true in order to tell just consider the capturing phase of events and not bubbling
    document.addEventListener("click", handleClick, listenCapturing);

    // removing it
    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return { ref };
}
