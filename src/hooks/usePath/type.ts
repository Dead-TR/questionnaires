export type SearchParams = Record<string, string[]>;

export interface SearchParamsState  {
  [key: string]: string | string[];
}
