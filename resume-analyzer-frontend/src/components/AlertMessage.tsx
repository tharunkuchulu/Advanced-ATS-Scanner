import { Alert, AlertColor, Snackbar } from "@mui/material";
import React from "react";

interface Props {
  open: boolean;
  message: string;
  severity?: AlertColor;
  onClose: () => void;
}

export default function AlertMessage({ open, message, severity = "info", onClose }: Props) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert severity={severity} onClose={onClose} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
