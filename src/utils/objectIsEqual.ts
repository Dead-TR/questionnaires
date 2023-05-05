type EqualValue = any[] | Record<string, any>;

export const objectIsEqual = (first: EqualValue, second: EqualValue) => {
  try {
    return JSON.stringify(first) == JSON.stringify(second);
  } catch {
    return false;
  }
};
