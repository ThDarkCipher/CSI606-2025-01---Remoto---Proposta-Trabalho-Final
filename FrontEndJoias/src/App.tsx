import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { Login } from './modules/Login';
import { SignUp } from './modules/SignUp';
import { Dashboard } from './modules/dashboard/Dashboard';
import { AuthProvider } from './providers/AuthContext';
import PrivateRoute from './providers/PrivateRoute';
import { TenancyCreate } from './modules/dashboard/TenancyCreate';
import { Overview } from './modules/dashboard/Overview';
import { PedrasBrutas } from './modules/dashboard/PedraBrutas';
import { Lotes } from './modules/dashboard/Lotes';
//import { Financeiro } from './modules/dashboard/Financeiro';

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
              <Route path='/dashboard' element={<Dashboard />} >
                <Route index element={<Overview />} />
                {/* Rotas filhas */}
                <Route path='pedras-brutas' element={<PedrasBrutas />} />
                <Route path='lotes' element={<Lotes />} />
                {/* <Route path='financeiro' element={<Financeiro/>} /> */}
              </Route>
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
