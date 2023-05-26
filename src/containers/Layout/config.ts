import { useAuth } from "containers/Providers";
import { usePath } from "hooks";
import { useMemo, useState } from "react";

export const navigate = [
  {
    text: "All Profiles",
    link: "/",
  },
  {
    text: "Favorites",
    link: "/favorites",
  },
];

export const useAdminPopUp = () => {
  const { page } = usePath();
  const { user, sightOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  const buttons = useMemo(
    () => [
      {
        text: "Add Profile",
        onClick: () => {
          page.navigate("/create");
          handleClose();
        },
      },
      {
        text: "Log Out",
        onClick: () => {
          sightOut();
          handleClose();
        },
      },
    ],
    [!!user],
  );

  return {
    buttons,
    isOpen,
    handleClose,
    handleOpen,
  };
};
