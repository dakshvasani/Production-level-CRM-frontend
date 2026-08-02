import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
  const [state, setState] = useState({ open: false, message: "", severity: "error" });

  const showSnackbar = useCallback((message, severity = "error") => {
    setState({ open: true, message, severity });
  }, []);

  useEffect(() => {
    const handler = (e) => showSnackbar(e.detail.message, "error");
    window.addEventListener("api-error", handler);
    return () => window.removeEventListener("api-error", handler);
  }, [showSnackbar]);

  const handleClose = () => setState((prev) => ({ ...prev, open: false }));

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={state.open} autoHideDuration={5000} onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={state.severity} variant="filled">
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => useContext(SnackbarContext);