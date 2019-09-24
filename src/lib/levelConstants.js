const EASY = 'easy';
const MEDIUM = 'medium';
const HARD = 'hard';

export const LEVELS = {
  EASY,
  MEDIUM,
  HARD,
};

export const sizes = {
  [EASY]: {
    numMines: 2,
    boardSize: 10,
  },
  [MEDIUM]: {
    numMines: 20,
    boardSize: 20,
  },
  [HARD]: {
    numMines: 30,
    boardSize: 20,
  },
};
