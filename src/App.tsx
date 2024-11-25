import SearchComponent from './components/Search.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navigation from "./components/Navigation.tsx"

import Dashboard from './pages/Dashboard.tsx';
import About from './pages/About.tsx';
import Analytics from './pages/Analytics.tsx';
import Comment from './pages/Comment.tsx';
import Product from './pages/Product.tsx';
import ProductList from './pages/ProductList.tsx';
import Cliente from './pages/Cliente.tsx';

function App() {
  
  return (
    <BrowserRouter>
      <main className="w-full h-screen flex flex-row relative">
      <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/comment" element={<Comment />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/product" element={<Product />} />
          <Route path="/productList" element={<ProductList />} />
          <Route path="/clientes" element={<SearchComponent />} />
          <Route path="/cliente/:id" element={<Cliente />} />
        </Routes>
        </main>
    </BrowserRouter>
  )
}

export default App