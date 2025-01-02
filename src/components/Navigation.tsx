import { motion, useAnimationControls } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx"; // Importamos el contexto
import NavigationLink from "./NavigationLink.tsx";
import {
  ChartBarIcon,
  UsersIcon,
  ArrowLeftStartOnRectangleIcon
} from "@heroicons/react/24/outline";

const containerVariants = {
  close: {
    width: "5rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "16rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
};

const svgVariants = {
  close: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, hasRole } = useAuth(); // Usamos hasRole
  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();

  useEffect(() => {
    if (isOpen) {
      containerControls.start("open");
      svgControls.start("open");
    } else {
      containerControls.start("close");
      svgControls.start("close");
    }
  }, [isOpen]);

  const handleOpenClose = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout(); // Llamamos a la función logout del contexto
  };

  return (
    <>
      <motion.nav
        variants={containerVariants}
        animate={containerControls}
        initial="close"
        className="bg-bansur flex flex-col z-10 gap-20 p-5 absolute top-0 left-0 h-full shadow shadow-neutral-400"
      >
        <div className="flex flex-row w-full justify-between place-items-center">
          <div> <img src="/images/logo-bansur-bco.png" className="w-32" /></div>
          <button
            className="p-1 rounded-full flex"
            onClick={() => handleOpenClose()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-8 h-8 stroke-neutral-200"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={svgVariants}
                animate={svgControls}
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {/* Enlace al Dashboard solo para roles 1 y 2 */}
          {hasRole([1, 2]) && (
            <NavigationLink name="Dashboard" path="/dashboard" isOpen={isOpen}>
              <ChartBarIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
            </NavigationLink>
          )}
          <NavigationLink name="Clientes" path="/clientes" isOpen={isOpen}>
            <UsersIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
          </NavigationLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 mt-5 text-white hover:text-white/50 transition"
          >
            <ArrowLeftStartOnRectangleIcon className="size-8" />
            {isOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </motion.nav>
    </>
  );
};

export default Navigation;