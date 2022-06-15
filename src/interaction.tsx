import { useState, useRef, useLayoutEffect } from "preact/hooks";
import useMouse from "@react-hook/mouse-position";
import { useEffect } from "preact/hooks";
import afbeelding from "./verhoudingen.svg";
import { useStore } from "@citolab/preact-store";
import { ActionType, StateModel } from "./store";
import configProps from "./config.json";
type PropTypes = typeof configProps;

const svgString = decodeURIComponent(afbeelding).replace("data:image/svg+xml,", "");

export const Interaction = ({ config, dom }: { config: PropTypes; dom: Document | ShadowRoot }) => {
  const { width, height } = config;
  const colors = config.colors.split(",");

  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);

  const svgContainer = useRef<HTMLDivElement>();
  const paintables = useRef<Element[]>();

  const [state, dispatch] = useStore<StateModel, ActionType>((type, payload) => {
    switch (type) {
      case "SET_COLOR": {
        const vlak = paintables.current.find((a) => a.getAttribute("data-name") == payload.id);
        vlak.setAttribute("fill", payload.color);
      }
    }
  });

  const mouse = useMouse(svgContainer, {
    fps: 60,
    enterDelay: 100,
    leaveDelay: 100,
  });

  if (mouse.isDown) {
    const element = dom.elementFromPoint(mouse.clientX, mouse.clientY);
    const ispaintable = paintables.current.find((p) => p == element);
    if (ispaintable && element.getAttribute("fill") !== `${selectedColor}`) {
      const vlakId = element.getAttribute("data-name");
      dispatch<{ id: string; color: string }>("SET_COLOR", { id: vlakId, color: selectedColor });
    }
  }

  useLayoutEffect(() => {
    svgContainer.current.innerHTML = svgString; // pk: insert the svg string as html
    width && (svgContainer.current.firstElementChild as SVGElement).setAttribute("width", width);
    height && (svgContainer.current.firstElementChild as SVGElement).setAttribute("height", height);
    paintables.current = [...svgContainer.current.querySelectorAll("#giveColor rect")];
    state.vlakken.forEach(({ id, color }) => {
      const vlakEl = paintables.current.find((a) => a.getAttribute("data-name") == id);
      vlakEl.setAttribute("fill", color);
    });
  }, [svgContainer]);

  return (
    <div className="flex flex-col h-full">
      <h1 class="mx-auto my-4 text-gray-500">Color the squares with your mouse</h1>
      <div className="flex justify-center" ref={svgContainer}></div>
      <div className="flex justify-center">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 -mt-2 p-1 w-auto flex items-center justify-center space-x-1">
          {colors.map((c, idx) => (
            <div
              className={` rounded-full border-4 w-10 h-10 ${
                c == selectedColor ? `border-opacity-70 border-gray-100 ` : `border-white`
              }`}
              style={{ background: `${c}` }}
              onClick={() => setSelectedColor(c)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


