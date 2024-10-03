import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "./provider/AuthProvider";
import AppRouter from "./router/AppRouter"; // Import the new AppRouter component

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <HelmetProvider>
        <div className="w-[1240px] m-auto">
          <AppRouter /> {/* Use the AppRouter component */}
        </div>
      </HelmetProvider>
    </AuthProvider>
  </StrictMode>
);
