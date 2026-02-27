import { useLayoutEffect, useState, useCallback } from "react";

import useSound from "use-sound";

import fail from '../sounds/fail.wav';
import tap1 from '../sounds/tap1.wav';
import tap2 from '../sounds/tap2.wav';
import tap3 from '../sounds/tap3.wav';
import tap4 from '../sounds/tap4.wav';
import stratComplete from '../sounds/stratComplete.wav';

export const InputArrows = ({ code, onComplete, onFail }) => {
  const [arrows, setArrows] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isError, setIsError] = useState(false);
  // eslint-disable-next-line
  const [inputBlocked, setInputBlocked] = useState(false);

  const [playTap1] = useSound(tap1, { preload: true });
  const [playTap2] = useSound(tap2, { preload: true });
  const [playTap3] = useSound(tap3, { preload: true });
  const [playTap4] = useSound(tap4, { preload: true });
  const [playFail] = useSound(fail, { preload: true });
  const [playStratComplete] = useSound(stratComplete, { preload: true, volume: 0.5 });

  // Cuando cambia el código, reiniciar el input y mostrar las flechas
useLayoutEffect(() => {
  if (code) {
    showArrows();
    setCurrentInput('');
    setIsError(false);
    //setInputBlocked(false)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [code]);

  const getArrowSymbol = (direction) => {
    switch (direction) {
      case 'w': return 'fa-sharp fa-solid fa-up';
      case 's': return 'fa-sharp fa-solid fa-down';
      case 'd': return 'fa-sharp fa-solid fa-right';
      case 'a': return 'fa-sharp fa-solid fa-left';
      default: return direction;
    }
  }

  // Mostrar las flechas basadas en el código
  const showArrows = () => {
    const arrowArray = code.split('');
    setArrows(arrowArray);
  }

  // Manejar la pulsación de teclas
  const handleKeyPress = useCallback((event) => {
    let pressedKey = '';

    //if (inputBlocked) return;

    // Mapear teclas a direcciones
    switch (event.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        pressedKey = 'w';
        playTap1();
        break;
      case 's':
      case 'arrowdown':
        pressedKey = 's';
        playTap2();
        break;
      case 'd':
      case 'arrowright':
        pressedKey = 'd';
        playTap3();
        break;
      case 'a':
      case 'arrowleft':
        pressedKey = 'a';
        playTap4();
        break;
      default:
        return;
    }


    setCurrentInput(prev => {
      const newInput = prev + pressedKey;

      // Verificar si la secuencia coincide hasta ahora
      if (code.startsWith(newInput)) {
        // Si la secuencia está completa
        if (newInput === code) {
          onComplete();
          playStratComplete();

          return '';
        }
        return newInput;
      }

      // Si la secuencia es incorrecta
      playFail();
      setIsError(true);
      //setInputBlocked(true);
      onFail && onFail();

      // Input en rojo
      setTimeout(() => {
        setIsError(false);
        setInputBlocked(false);
      }, 200);

      return '';
    });

    event.preventDefault();
    // eslint-disable-next-line
  }, [code, onComplete]);

  // Añadir y remover el event listener
  useLayoutEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);



  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 items-center justify-center my-4">
        {arrows.map((direction, index) => (
          <span
            key={index}
            className={`select-none duration-50 ${isError ? 'text-[#ff2d2d]' :
                index < currentInput.length ? 'opacity-100 text-[#FFE710]' : 'opacity-50'
              }`}
          >
            <i className={`text-6xl ml-1 ${getArrowSymbol(direction)}`}></i>
          </span>
        ))}
      </div>
      <div className="text-sm text-neutral-500">
        Use WASD or Arrow Keys
      </div>
    </div>
  )
}
