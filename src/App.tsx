import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import About from "./pages/About.tsx";
import Product from "./pages/Product.tsx";
import ProductList from "./pages/ProductList.tsx";
import Clientes from "./pages/Clientes.tsx";
import Cliente from "./pages/Cliente.tsx";
import ClienteAdd from "./pages/ClienteAdd.tsx";
import DefaultLayout from "./layout/DefaultLayout.tsx";
import { AuthProvider } from "./context/AuthContext.tsx"; // Importa AuthProvider

// Login Layout (puede ser vacío o específico)
const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={
              <LoginLayout>
                <Login />
              </LoginLayout>
            }
          />
          {/* Default Layout for Protected Routes */}
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/product" element={<Product />} />
            <Route path="/productList" element={<ProductList />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/cliente/:id" element={<Cliente />} />
            <Route path="/cliente/add" element={<ClienteAdd />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
