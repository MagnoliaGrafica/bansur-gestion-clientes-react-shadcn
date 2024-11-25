import { motion } from "framer-motion"
import { Link } from "react-router-dom"

interface Props {
  children: React.ReactNode
  name: string
  path: string // Nueva propiedad para la ruta
  isOpen: boolean
}

const NavigationLink = ({ children, name, path, isOpen }: Props) => {
  return (
    <Link
      to={path} // Usamos 'to' para especificar la ruta
      className="flex p-1 rounded cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100"
    >
      {children}
      {isOpen && (
        <motion.p
          className="text-inherit font-poppins overflow-clip whitespace-nowrap tracking-wide"
          initial={{ opacity: 0, x: -10 }} // Inicia invisible y desplazado ligeramente
          animate={{ opacity: 1, x: 0 }} // Aparece y se posiciona correctamente
          exit={{ opacity: 0, x: -10 }} // Desaparece con un pequeño desplazamiento
          transition={{ duration: 0.3, ease: "easeInOut" }} // Suaviza la transición
        >
          {name}
        </motion.p>
      )}
    </Link>
  )
}

export default NavigationLink

