import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard.tsx';
import About from './pages/About.tsx';
import Analytics from './pages/Analytics.tsx';
import Comment from './pages/Comment.tsx';
import Product from './pages/Product.tsx';
import ProductList from './pages/ProductList.tsx';
import Clientes from './pages/Clientes.tsx';
import Cliente from './pages/Cliente.tsx';
import ClienteAdd from './pages/ClienteAdd.tsx';
import DefaultLayout from './layout/DefaultLayout.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Aplica DefaultLayout como un wrapper */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/comment" element={<Comment />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/product" element={<Product />} />
          <Route path="/productList" element={<ProductList />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/cliente/:id" element={<Cliente />} />
          <Route path="/cliente/add" element={<ClienteAdd />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
