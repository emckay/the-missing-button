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
