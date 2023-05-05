export const rangeBetween = (value: number, min: number, max: number) =>
  Math.min(
    Math.max(value, min), //find max
    max, // find min
  );
