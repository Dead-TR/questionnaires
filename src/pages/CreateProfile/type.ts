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
  height: string | number;
  weight: string | number;

  etc: string;
}

export interface PhotosState {
  file?: File;
  name?: string;
  link: string;
}

export interface FrontProfile extends ProfileState {
  photos: { link: string; name: string; isAvatar: boolean }[];
}

export interface ServerProfile extends ProfileState {
  photos: { name: string; isAvatar: boolean }[];
}
