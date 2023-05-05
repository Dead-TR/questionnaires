import { memo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import {
  Autocomplete,
  Box,
  Card,
  Container,
  Stack,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//@ts-ignore
import moment from "moment";

import { getFetch } from "utils/fetch";
import css from "./style.module.scss";
import { Country, CountryFetch } from "./type";
import debounce from "lodash.debounce";

const wait = debounce((f: () => void) => {
  f();
}, 50);

moment.updateLocale("en", {
  week: {
    dow: 1,
  },
});

const CreateProfile = () => {
  const dragCard = useRef<HTMLDivElement>(null);

  const [countries, setCountries] = useState<Country[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [state, setState] = useState({
    name: "",
    birthday: 0,
    children: 0,
    marital: "",
    job: "",
    country: "",
    city: "",
  });
  console.log("🚀 ~ file: index.tsx:46 ~ CreateProfile ~ state:", state);

  const toggle = (add: boolean) => {
    if (!dragCard.current) return;
    const { classList } = dragCard.current;

    if (add) classList.add(css.activeCard);
    else classList.remove(css.activeCard);
  };

  const handleChange = <K extends keyof typeof state>(
    key: K,
    value: (typeof state)[K],
  ) => {
    setState((old) => ({ ...old, [key]: value }));
  };

  const getCounty = (value: string) => {
    setCountries([]);
    const request = async () => {
      if (!value) return;

      const result = await getFetch<CountryFetch[]>(
        `https://restcountries.com/v3.1/name/${value}`,
      );

      setCountries(
        (result.data || [])?.map(({ flag, name: { common, official } }) => ({
          flag,
          name: official,
        })),
      );
    };

    wait(() => {
      request();
    });

    handleChange("country", value);
  };

  return (
    <Container sx={{ py: 5 }}>
      <Box sx={{ mx: "auto", maxWidth: 550 }}>
        <Dropzone
          onDrop={(acceptedFiles) => {
            const links = acceptedFiles.map((v) => URL.createObjectURL(v));
            setPhotos(links);
          }}
          onDragOver={() => toggle(true)}
          onDragLeave={() => toggle(false)}>
          {({ getRootProps, getInputProps }) => {
            const props = getRootProps();

            return (
              <Card variant="outlined" sx={{ p: 5 }} {...props} ref={dragCard}>
                <input {...getInputProps()} />
                <p className={css.text}>Add Photos</p>
              </Card>
            );
          }}
        </Dropzone>
      </Box>

      <Box sx={{ my: 4 }}>
        <div className={css.imgWrapper}>
          {photos.map((v, i) => {
            return (
              <img
                src={v}
                alt={"" + i}
                loading="lazy"
                onClick={() => {
                  const updatePhotos = photos.filter((img) => img !== v);
                  setPhotos(updatePhotos);
                }}
              />
            );
          })}
        </div>
      </Box>

      <Box
        sx={{
          my: 4,
          maxWidth: 900,
          width: "100%",
          mx: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
        }}>
        <TextField
          label="Full Name"
          variant="outlined"
          value={state.name}
          onChange={({ target }) => {
            handleChange("name", target.value);
          }}
        />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            format="DD/MM/YYYY"
            onChange={(v: any) => {
              const birth = v.valueOf();
              handleChange("birthday", birth);
            }}
          />
        </LocalizationProvider>
        <TextField
          label="Children"
          type="number"
          variant="outlined"
          value={state.children}
          defaultValue={state.children}
          onChange={({ target }) => {
            const amount = Number(target.value);
            handleChange("children", Math.max(0, amount));
          }}
        />
        <Autocomplete
          freeSolo
          options={["Single", "Married", "Divorced", "Widowed"]}
          onChange={({ target }) => {
            const value = (target as HTMLElement)?.innerText || "";
            handleChange("marital", value);
          }}
          onBlur={({ target }) => {
            const value = (target as HTMLInputElement)?.value || "";
            handleChange("marital", value);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Marital Status" variant="outlined" />
          )}
        />
        <TextField
          label="Job"
          variant="outlined"
          onChange={({ target }) => {
            handleChange("job", target.value);
          }}
        />

        <Autocomplete
          freeSolo
          open={!!countries.length}
          options={countries.map(({ flag, name }) => `${flag} ${name}`)}
          onChange={({ target }) => {
            const value = (target as HTMLElement)?.innerText || "";
            getCounty(value);
          }}
          onBlur={({ target }) => {
            const value = (target as HTMLInputElement)?.value || "";
            getCounty(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              variant="outlined"
              onChange={({ target }) => {
                getCounty(target.value);
              }}
            />
          )}
        />

        <div />

        <TextField
          label="City"
          variant="outlined"
          onChange={({ target }) => {
            handleChange("city", target.value);
          }}
        />
      </Box>
    </Container>
  );
};

export default memo(CreateProfile);
