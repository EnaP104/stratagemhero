import { useState, useCallback, useLayoutEffect, useRef } from 'react';
import { Game } from './Game';

import useSound from 'use-sound';
import loopSong from '../sounds/loop.mp3';
import { useNavigate } from 'react-router';

export const Menu = () => {

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(true);
  const [playMusic, { stop }] = useSound(loopSong, { loop: true, volume: 0.5 });
  const [musicEnabled, setMusicEnabled] = useState(localStorage.getItem("music") || "on");

  const musicEnabledRef = useRef(musicEnabled);
  musicEnabledRef.current = musicEnabled; // actualizar en cada render

  const [topHighscores, setTopHighscores] = useState(() => {
    const saved = localStorage.getItem("topHighscores");
    return saved ? saved.split(',').map(Number) : [];
  }); // highscores


  const [highscore, setHighscore] = useState(() => {
    const saved = localStorage.getItem("highscore");
    return saved ? parseInt(saved) : 0; // si no hay valor, inicializa en 0
  });

  const toggleMusic = () => {
    const newValue = musicEnabled === "on" ? "off" : "on";
    setMusicEnabled(newValue);
    localStorage.setItem("music", newValue);
  }

  const startGame = () => {
    setShowMenu(false);
    //if (musicEnabledRef.current === "on") playMusic();
    //console.log("Game started");
  }

  // Manejar la pulsación de teclas
  const handleKeyPress = useCallback((event) => {
    const key = event.key.toLowerCase();
    if (!showMenu) return;

    //Toggle music
    if (key === 'm') {
      toggleMusic();
      event.preventDefault();

      //Start Game
    } else if (key === 'enter' || key === ' ') {
      startGame();
      event.preventDefault();
    }
    // eslint-disable-next-line
  }, [showMenu, musicEnabled]);

  // Añadir y remover el event listener
  useLayoutEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <main>
        <div className='bg-neutral-900 text-white min-h-screen flex flex-col justify-center items-center w-full'>
          {showMenu ? (
            <>
              {/* Botón de música en el menú */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button onClick={toggleMusic}>
                  <i className={`fa-sharp fa-solid ${musicEnabled === "on" ? "fa-volume" : "fa-volume-slash"} text-2xl`}></i>
                </button>
                <p className="text-neutral-400 mr-1">[M] Music</p>
              </div>

              {/* Botón usar simulador */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <button className='border-2 border-neutral-400 px-1' onClick={()=>navigate("/pad")}>
                  <i className='fa-sharp fa-solid fa-gamepad text-2xl'></i>
                </button>
                <p className="text-neutral-400 mr-1">Simulator</p>
              </div>

              {/* Top highscores */}
              <div className="absolute right-4 flex items-center gap-2">
                <div className='text-white border-2 border-neutral-400 p-2 rounded-md'>
                  <h2 className='text-center'>Your Highscores</h2>
                  <ol>
                    {topHighscores && topHighscores.length > 0 ? (
                      topHighscores.map((score, index) => (
                        <li key={index}>{index + 1}. <span className="text-yellow-400">{score}</span></li>
                      ))
                    ) : (
                      <li className="text-neutral-400">No highscores yet</li>
                    )}
                  </ol>
                </div>
              </div>


              {/* Enlace a GitHub */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-40">
                <a href="https://github.com/EnaP104"
                  target='_blank'
                  rel="noreferrer"
                  className='hover:text-white opacity-100'>
                  <i className="fa-brands fa-github mr-2"></i>
                </a>
              </div>

              <div>
                <h1 className='text-5xl'>Stratagem Hero</h1>
                <p className='opacity-70'>Inspired on Helldivers 2</p>
                <br />
                <div>
                  <p className='text-2xl'>HIGHSCORE: <span className="text-yellow-400">{highscore || "0"}</span></p>
                  <button onClick={startGame} className='text-3xl border-2 p-2 mt-2 hover:bg-neutral-700 hover:border-yellow-300 w-full'>Start game</button>
                  <p className="text-neutral-400 text-center">[Enter] [Spacebar]</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <Game showMenu={setShowMenu} stopMusic={stop} playMusic={playMusic} musicEnabled={musicEnabled} highscore={highscore} setHighscore={setHighscore} setTopHighscores={setTopHighscores} />
            </>
          )}
        </div>
      </main>
    </>
  )
}
