import { Drawer, Toolbar, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth } from "../../context/AuthContext";

const ALL_NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/", roles: null },
  { label: "Customers", icon: <PeopleIcon />, path: "/customers", roles: null },
  { label: "Deals", icon: <BusinessCenterIcon />, path: "/deals", roles: null },
  { label: "Users", icon: <GroupIcon />, path: "/users", roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Teams", icon: <GroupsIcon />, path: "/teams", roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Settings", icon: <SettingsIcon />, path: "/settings", roles: ["SUPER_ADMIN", "ADMIN"] },
];

export default function Sidebar({ drawerWidth, mobileOpen, onClose }) {
  const { user } = useAuth();

  const visibleItems = ALL_NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  const drawerContent = (
    <>
      <Toolbar />
      <List>
        {visibleItems.map((item) => (
          <ListItemButton key={item.label} component={NavLink} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}