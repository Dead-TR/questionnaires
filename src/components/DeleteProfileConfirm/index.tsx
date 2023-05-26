import { Box, Button, Container, Modal, Typography } from "@mui/material";
import { useProfiles } from "containers";
import React, { FC } from "react";

interface Props {
  profileId: string | number | null;
  setProfileId: (v: string | number | null) => void;
}

export const DeleteProfileConfirm: FC<Props> = ({
  profileId,
  setProfileId,
}) => {
  const { removeProfile } = useProfiles();

  return (
    <Modal
      open={!!profileId}
      onClose={() => setProfileId(null)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Container
        sx={{
          background: "white",
          display: "flex",
          flexDirection: "column",
          width: "fit-content",
          p: 2,
          borderRadius: 2,
        }}>
        <Typography
          sx={{
            mb: 4,
          }}>
          Are you sure you want to delete the profile?
        </Typography>
        <Box sx={{ mx: "auto" }}>
          <Button
            onClick={() => {
              removeProfile("" + profileId);
              setProfileId(null);
            }}>
            Yes
          </Button>
          <Button onClick={() => setProfileId(null)}>No</Button>
        </Box>
      </Container>
    </Modal>
  );
};
