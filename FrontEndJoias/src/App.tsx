import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { Login } from './modules/Login';
import { SignUp } from './modules/SignUp';
import { Dashboard } from './modules/Dashboard';
import { AuthProvider } from './providers/AuthContext';
import PrivateRoute from './providers/PrivateRoute';
import { TenancyCreate } from './modules/TenancyCreate';


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            {/* ... Rotas do Login e Register ... */}
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<SignUp />} />
            <Route element={<PrivateRoute hasRoles={null} />}>
              <Route path='/dashboard' element={<Dashboard />} />
              {/* Rotas filhas */}
              <Route path='pedras-brutas' element={<div>💎 Tela de Pedras Brutas (Tabela vai aqui)</div>} />
              <Route path='lotes' element={<div>📦 Tela de Lotes (Cards vão aqui)</div>} />
              <Route path='financeiro' element={<div>💰 Tela do Financeiro</div>} />
            </Route>
            <Route element={<PrivateRoute hasRoles={["Admin"]} />}>
              <Route path='/tenancy/create' element={<TenancyCreate />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
