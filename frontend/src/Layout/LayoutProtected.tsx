import { Outlet } from "react-router-dom";
import { AppBar } from "../components/AppBar/AppBar";
import { ProtectedRoute } from "../utils/Route.Protect";

export const LayoutProtected = () => {
  return (
    <>
      <AppBar />
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    </>
  );
};
