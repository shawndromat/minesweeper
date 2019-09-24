import React, { useState } from 'react';
import './App.css';
import Game from './lib/Game';
import { LEVELS } from './lib/levelConstants';
import Cell from './Cell';

const App = () => {
  const [game, setGame] = useState(new Game());
  const [display, setDisplay] = useState(game.getDisplay());

  const onCellClick = (coords) => {
    if (display.done) return;
    game.revealCell(coords);
    setDisplay(game.getDisplay())
  };

  return (
    <div className="App">
        <h2>{display.status}</h2>
          {
            display.grid.map((row, x) =>
              <div className="gameRow" key={`row-${x}`}>
                {
                  row.map((cell, y) =>
                    <Cell
                      key={`${x} ${y}`}
                      revealed={cell.revealed}
                      value={cell.value}
                      onClick={() => {
                        onCellClick({x, y})
                      }}
                    />
                  )
                }
              </div>
            )
          }
        <div>
          {/*{*/}
          {/*  LEVELS.map(level =>*/}
          {/*    <button onClick={() => setGame(new Game(level))}>{level}</button>*/}
          {/*  )*/}
          {/*}*/}
        </div>
    </div>
  );
};

export default App;
