import React, { FC, useEffect, useRef, useState } from "react";

import { Autocomplete, Box, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//@ts-ignore
import moment from "moment";

import debounce from "lodash.debounce";
import { Textarea } from "@mui/joy";

import dateformat from "dateformat";

import { ProfileState, Country, CountryFetch } from "pages/CreateProfile/type";
import { getFetch } from "utils/fetch";
import { sleep } from "utils";
import css from "../../style.module.scss";
import clsx from "clsx";

const wait = debounce((f: () => void) => {
  f();
}, 50);

moment.updateLocale("en", {
  week: {
    dow: 1,
  },
});

interface Props {
  state: ProfileState;
  setState: React.Dispatch<React.SetStateAction<ProfileState>>;
}

export const TextFields: FC<Props> = ({ state, setState }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [showText, setShowText] = useState(true);
  const input = useRef<HTMLInputElement>(null);
  console.log("🚀 ~ file: index.tsx:37 ~ state:", state.birthday, showText);

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

  useEffect(() => {}, []);

  useEffect(() => {
    if (!state.birthday) {
      setShowText(true);
    }

    const blur = () => {
      if (!state.birthday) {
        setShowText(true);
      }
    };
    const focus = () => setShowText(false);

    input.current?.addEventListener("focus", focus);
    input.current?.addEventListener("blur", blur);

    return () => {
      input.current?.removeEventListener("focus", focus);
      input.current?.removeEventListener("blur", blur);
    };
  }, [state.birthday]);

  return (
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
        label="Name"
        variant="outlined"
        value={state.name}
        onChange={({ target }) => {
          handleChange("name", target.value);
        }}
        error={!state.name}
      />
      <div
        className={clsx(
          css.dateWrapper,
          showText && css.hideDate,
          !state.birthday && css.error,
        )}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            format="DD/MM/YYYY"
            onChange={(v: any) => {
              const birth = v.valueOf();
              handleChange("birthday", birth);
            }}
            inputRef={input}
          />
        </LocalizationProvider>

        {showText && (
          <div className={css.dateFormat}>
            <span>
              {state.birthday
                ? dateformat(state.birthday, "dd/mm/yyyy")
                : "DD/MM/YYYY"}
            </span>
          </div>
        )}
      </div>
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
        value={state.marital}
      />
      <TextField
        label="Job"
        variant="outlined"
        onChange={({ target }) => {
          handleChange("job", target.value);
        }}
        value={state.job}
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
        value={state.country}
      />

      <Textarea
        className={css.textArea}
        minRows={5}
        sx={{ width: "100%" }}
        placeholder="Other"
        value={state.etc}
        onChange={({ target }) => {
          handleChange("etc", target.value);
        }}
      />

      <TextField
        label="City"
        variant="outlined"
        onChange={({ target }) => {
          handleChange("city", target.value);
        }}
      />
    </Box>
  );
};
