export interface Country {
  name: string;
  flag: string;
}

export interface CountryFetch {
  flag: string;

  name: {
    common: string;
    official: string;
  };
}
