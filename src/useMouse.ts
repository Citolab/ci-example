import { useEffect, useState } from "react";

export const useMouse = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const setPosFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const setDownFromEvent = (e) => setMouseDown(e);
    window.addEventListener("mousemove", setPosFromEvent);
    window.addEventListener("mousedown", setDownFromEvent(true));
    window.addEventListener("mousup", setDownFromEvent(false));
    window.addEventListener("mouseout", setDownFromEvent(false));

    return () => {
        window.removeEventListener("mousemove", setPosFromEvent);
        window.addEventListener("mousedown", setDownFromEvent);
        window.addEventListener("mousup", setDownFromEvent);
        window.addEventListener("mouseout", setDownFromEvent);
    };

  }, []);

  return { clientX: position.x, clientY: position.y, isDown: mouseDown }
};