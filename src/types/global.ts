//#region Path
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];

/** The full path of all keys of the object passed to it */
export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : "";

/**Full sets final paths to full variables inside the object */
export type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : "";

//#endregion Path

//#region ArrayRepeats
type RemoveArrayRepeats<T extends readonly any[]> = {
  [K in keyof T]: T[number] extends {
    [P in keyof T]: P extends K ? never : T[P];
  }[number]
    ? never
    : T[K];
};
/**Allows passing only unique values ​​to the array.
 ** Example:
 ** type Elements = "0" | "1" | "2";
 ** const get = <T extends Elements[]>(order: UniqueArrayArguments<T>) => void
 **
 ** get(["0"]); // good
 ** get(["0", "1", "2"]); // good
 ** get(["0", "1", "2", "0"]); // error
 */
export type UniqueArrayArguments<T extends any[]> =
  | (T & RemoveArrayRepeats<T>)
  | [];
//#endregion ArrayRepeats

type ArrayLengthMutationKeys = "splice" | "push" | "pop" | "shift" | "unshift";
/**array has a specific length
 ** example:
 *
 ** const arr: FixedLengthArray<string, 3> = ['string', 'string', 'string']; //ok
 ** const arr: FixedLengthArray<string, 3> = ['string']; //no ok
 */
export type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> =
  Pick<TObj, Exclude<keyof TObj, ArrayLengthMutationKeys>> & {
    readonly length: L;
    [I: number]: T;
    [Symbol.iterator]: () => IterableIterator<T>;
  };
