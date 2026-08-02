import { Component } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10, px: 2 }}>
          <Paper sx={{ p: 4, maxWidth: 420, textAlign: "center" }}>
            <Typography variant="h6" mb={1}>Something went wrong</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              This section hit an unexpected error. Try reloading the page.
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </Paper>
        </Box>
      );
    }
    return this.props.children;
  }
}