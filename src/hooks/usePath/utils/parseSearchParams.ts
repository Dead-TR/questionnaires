import { Location } from "react-router";
import { SearchParamsState } from "hooks/usePath/type";

export const parseSearchParams = (
  searchParams: SearchParamsState,
  location: Location,
) => {
  const params = new URLSearchParams(location.search);
  Object.entries(searchParams).forEach(([key, values]) => {
    if (typeof values === "string") params.set(key, values);
    else values.forEach((value) => params.append(key, value));
  });

  return params;
};
