import { Outlet } from "react-router-dom";
import { UnProtectedRoute } from "../utils/Route.Protect";

export const LayoutUnProtected = () => {
  return (
    <>
      <UnProtectedRoute>
        <Outlet />
      </UnProtectedRoute>
    </>
  );
};
