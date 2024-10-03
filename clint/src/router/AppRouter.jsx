import React, { useContext } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { createAppRouter } from "./router";

const AppRouter = () => {
  const { user } = useContext(AuthContext); // Now this is inside a functional component
  const role = user?.role || 'guest'; // Get role from user context

  const router = createAppRouter(role); // Pass role to the router setup

  return (
    <RouterProvider router={router} /> // Render the RouterProvider here
  );
};

export default AppRouter;
