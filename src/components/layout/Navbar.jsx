import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar({ onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          CRM
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* User avatar / notifications go here in later days */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}