import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

const DefaultLayout = () => {
  return (
    <div>
      {/* Aquí está el Navigation que será común para todas las rutas */}
      <Navigation />
      <main className="w-full h-screen flex flex-row relative bg-white pl-28">
        {/* Aquí se renderizarán las rutas secundarias */}
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;