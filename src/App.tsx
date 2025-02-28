import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import About from "./pages/About.tsx";
import Product from "./pages/Product.tsx";
import ProductList from "./pages/ProductList.tsx";
import Clientes from "./pages/Clientes.tsx";
import Cliente from "./pages/Cliente.tsx";
import ClienteAdd from "./pages/ClienteAdd.tsx";
import Rechazados from "./pages/Rechazados.tsx";
import Cursados from "./pages/Cursados.tsx";
import DefaultLayout from "./layout/DefaultLayout.tsx";
import LoginLayout from "./layout/LoginLayout.tsx";
import ProtectedRoute from "./layout/ProtectedRoute.tsx"; 
import { AuthProvider } from "./context/AuthContext.tsx"; 

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
          <Route element={<ProtectedRoute />}>
  <Route element={<DefaultLayout />}>
  <Route path="/" element={<Dashboard />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/about" element={<About />} />
    <Route path="/product" element={<Product />} />
    <Route path="/productList" element={<ProductList />} />
    <Route path="/clientes" element={<Clientes />} />
    <Route path="/clientes/rechazados" element={<Rechazados />} />
    <Route path="/clientes/cursados" element={<Cursados />} />
    <Route path="/cliente/:id" element={<Cliente />} />
    <Route path="/cliente/add" element={<ClienteAdd />} />
  </Route>
</Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
