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

export interface ProfileState {
  name: string;
  birthday: number;
  children: number;
  marital: string;
  job: string;
  country: string;
  city: string;

  etc: string;
}

export interface PhotosState {
  file: File;
  link: string;
}