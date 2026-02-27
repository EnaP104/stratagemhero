import React from "react";
import stratagems from "../data/stratagems.json";

export const ModalInfo = ({ stratagemCodesMap, onClose }) => {

  const codesWithSfx = Object.keys(stratagemCodesMap);

  const stratagemsWithSfx = stratagems.filter(s =>
    codesWithSfx.includes(s.code)
  );

  const getArrowSymbol = (direction) => {
    switch (direction) {
      case 'w': return 'fa-sharp fa-solid fa-up';
      case 's': return 'fa-sharp fa-solid fa-down';
      case 'd': return 'fa-sharp fa-solid fa-right';
      case 'a': return 'fa-sharp fa-solid fa-left';
      default: return direction;
    }
  }

  return (
    <div
      className="
        fixed top-1/2 right-0 -translate-x -translate-y-1/2
        bg-black/70
         h-70 p-1 text-white
        z-50
      "
    >
      {/* HEADER */}
      <div className="flex justify-between items-center ml-2">
        <p className="text-md">Stratagems with SFX</p>

        <button onClick={onClose}>
          <i className="fa-solid fa-sharp fa-xmark border-2 border-white px-2 text-white text-lg"></i>
        </button>
      </div>

      {/* LISTA DE STRATAGEMS */}
      <div className="flex flex-col 
        overflow-y-auto h-60">
        {stratagemsWithSfx.map(strat => (
          <div
            key={strat.id}
            className="flex items-center gap-2 p-1 bg-black/40"
          >
            <img
              src={`/stratagem_icons/${strat.name}.svg`}
              alt={strat.name}
              width="40"
              draggable="false"
              className="border-2 border-[#FFE710]"
            />

            <div>
              <p className="text-xs">{strat.name}</p>

              <div className="flex gap-1">
                {[...strat.code].map((dir, i) => (
                  <i
                    key={i}
                    className={`${getArrowSymbol(dir)} text-white`}
                  ></i>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

