import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Toaster } from "sonner";

const DefaultLayout = () => {
  return (
    <div>
      {/* Navigation común para todas las rutas */}
      <Navigation />

      {/* Toaster para los avisos tipo toast */}
      <Toaster position="top-right" richColors />

      <main className="w-full flex flex-row relative bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
