import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import RoleGuard from "./components/routing/RoleGuard";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UserList from "./pages/users/UserList";
import UserForm from "./pages/users/UserForm";
import TeamList from "./pages/teams/TeamList";
import OrganizationSettings from "./pages/settings/OrganizationSettings";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />

            <Route element={<RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]} />}>
              <Route path="users" element={<UserList />} />
              <Route path="users/new" element={<UserForm />} />
              <Route path="users/:id/edit" element={<UserForm />} />
              <Route path="teams" element={<TeamList />} />
              <Route path="settings" element={<OrganizationSettings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;