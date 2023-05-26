import { Fragment, useMemo, useState } from "react";
import { Pagination } from "@mui/material";

import { useProfiles } from "containers";
import { FallBack } from "components/FallBack";

import css from "./style.module.scss";
import { ProfileCard } from "./Card";
import { DeleteProfileConfirm } from "components/DeleteProfileConfirm";
import { usePath } from "hooks";

const maxProfilesPerPage = 20;

const Home = () => {
  const { page: nav } = usePath();
  const {
    profiles,
    loading,
    favorites,
    changeFavorites: addToFavorites,
  } = useProfiles();
  const [deleteProfileId, setDeleteProfileId] = useState<
    number | string | null
  >(null);

  const [page, setPage] = useState(1);

  const changePage = (p: number) => {
    setPage(p);

    document.body.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  };

  const pagesAmount = Math.ceil(
    Object.values(profiles).length / maxProfilesPerPage,
  );

  const isFavorites = useMemo(
    () => nav.path.substring(1) === "favorites",
    [nav.path],
  );

  return (
    <>
      <Pagination
        count={pagesAmount}
        page={page}
        onChange={(e, page) => changePage(page)}
      />
      <div className={css.root}>
        {Object.entries(profiles)
          .filter(([id]) => {
            if (isFavorites) {
              return favorites[id];
            } else {
              return true;
            }
          })
          .map(([id, { birthday = Infinity, photos, ...etc }], i) => {
            if (
              i < (page - 1) * maxProfilesPerPage ||
              i >= page * maxProfilesPerPage
            )
              return null;

            return (
              <Fragment key={`profile_${id}`}>
                <ProfileCard
                  {...{
                    birthday,
                    photos,
                    ...etc,
                    id,
                    handleRemove: setDeleteProfileId,
                    isFavorite: !!favorites[id],
                    setFavorite: addToFavorites,
                  }}
                />
              </Fragment>
            );
          })}
      </div>
      <FallBack show={loading} />

      {!loading && pagesAmount > 1 && (
        <Pagination
          count={pagesAmount}
          page={page}
          onChange={(e, page) => changePage(page)}
        />
      )}

      <DeleteProfileConfirm
        profileId={deleteProfileId}
        setProfileId={setDeleteProfileId}
      />
    </>
  );
};

export default Home;
