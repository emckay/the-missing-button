import { sample, shuffle } from "lodash";

export const adjectives = {
  color: ["red", "black", "blue"] as const,
  size: ["small", "large"] as const,
  holes: ["two", "four"] as const,
  shape: ["square", "round"] as const,
};

export type ButtonColor = (typeof adjectives.color)[number];
export type ButtonSize = (typeof adjectives.size)[number];
export type ButtonHoles = (typeof adjectives.holes)[number];
export type ButtonShape = (typeof adjectives.shape)[number];

export type ButtonType = {
  color: ButtonColor;
  size: ButtonSize;
  holes: ButtonHoles;
  shape: ButtonShape;
};

const clueToLabelTextString = (category: ClueCategory, value: string) => {
  if (category === "holes") {
    return `with ${value} holes`;
  }
  return value;
};

export const cluesToLabelTexts = (clues: Clues) => {
  const preCategoryOrder: ClueCategory[] = ["size", "color", "shape"];
  const postCategoryOrder: ClueCategory[] = ["holes"];
  const labels = ["my"];
  for (const cat of preCategoryOrder) {
    const clue = clues[cat];
    if (clue !== null) {
      labels.push(clueToLabelTextString(cat, clue));
    }
  }
  labels.push("button");
  for (const cat of postCategoryOrder) {
    const clue = clues[cat];
    if (clue !== null) {
      labels.push(clueToLabelTextString(cat, clue));
    }
  }
  return labels;
};

const cartesianProduct = (...arrays: any[]) => {
  return arrays.reduce(
    (a, b) => {
      return a
        .map((x: any) => {
          return b.map((y: any) => {
            return x.concat([y]);
          });
        })
        .flat();
    },
    [[]]
  );
};

export const generateButtonTypes = (): ButtonType[] => {
  const keys = Object.keys(adjectives) as Array<keyof typeof adjectives>;
  const values = keys.map((key) => adjectives[key]);
  const combinations = cartesianProduct(...values);

  return combinations.map((combination: any) => {
    return combination.reduce(
      (obj: Partial<ButtonType>, value: any, index: any) => {
        obj[keys[index]] = value;
        return obj as ButtonType;
      },
      {}
    );
  });
};

export type ClueCategory = keyof typeof adjectives;
export type Clues = {
  [P in ClueCategory]: (typeof adjectives)[P][number] | null;
};

export const getBlankClues = (): Clues => {
  return {
    color: null,
    holes: null,
    size: null,
    shape: null,
  };
};

export const doButtonsMatch = (a: ButtonType, b: ButtonType) => {
  return (
    a.size === b.size &&
    a.color === b.color &&
    a.holes === b.holes &&
    a.shape === b.shape
  );
};

export const doesButtonMatchClues = (button: ButtonType, clues: Clues) => {
  for (const [clueCategory, clue] of Object.entries(clues)) {
    if (clue === null) continue;
    if (button[clueCategory as ClueCategory] !== clue) return false;
  }
  return true;
};
type WinnerResult = { isWinner: true };
type LoserResult = { isWinner: false; wrongGuess: boolean };
// prettier-ignore
type Clue = 
| { category: 'color', value: Required<Clues['color']>}
| { category: 'size', value: Required<Clues['size']>}
| { category: 'shape', value: Required<Clues['shape']>}
| { category: 'holes', value: Required<Clues['holes']>};

type NextClueResult = WinnerResult | ({ clue: Clue } & LoserResult);

const findButtonMatchingClues = (
  clues: Clues,
  options: ButtonType[],
  exclude: ButtonType
): Clue | null => {
  const remainingOptions = options.filter(
    (o) =>
      doesButtonMatchClues(o, clues) &&
      (!exclude || !doButtonsMatch(exclude, o))
  );

  if (remainingOptions.length === 0) {
    return null;
  }

  const nextOption = sample(remainingOptions)!;
  const category = sample(
    (Object.keys(adjectives) as ClueCategory[]).filter(
      (k) => clues[k] === null && exclude[k] !== nextOption[k]
    )
  )!;
  return { category, value: nextOption[category] } as Clue;
};

/**
 * @param buttonOptions - list of all options at the time of the guess (including the guess)
 */
export const getNextClue = (
  guess: ButtonType,
  buttonOptions: ButtonType[],
  knownClues: Clues
): NextClueResult => {
  // Somehow the guess was not one of the options.
  if (buttonOptions.every((o) => !doButtonsMatch(o, guess))) {
    const res = findButtonMatchingClues(knownClues, buttonOptions, guess);
    if (res === null) {
      // Shouldn't happen but if it does, fail.
      throw new Error(
        "button not in set and somehow no possible buttons found"
      );
    }
    return { isWinner: false, clue: res, wrongGuess: false };
  }

  // If guess is wrong for any of the known clues, not a winner and give that clue again.
  const randomizedClueOrder = shuffle(Object.entries(knownClues));
  for (const [clueCategory, clue] of randomizedClueOrder) {
    if (clue === null) continue;
    const isCorrect = guess[clueCategory as ClueCategory] === clue;
    if (!isCorrect) {
      return {
        isWinner: false,
        wrongGuess: true,
        clue: {
          category: clueCategory as ClueCategory,
          value: knownClues[clueCategory as ClueCategory],
        } as Clue,
      };
    }
  }

  const res = findButtonMatchingClues(knownClues, buttonOptions, guess);
  // If there are no other options it could possibly be, this is the winner. Otherwise give a clue for that option.
  if (res === null) {
    return { isWinner: true };
  }
  return {
    isWinner: false,
    wrongGuess: false,
    clue: res,
  };
};
