import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IsNotAuthenticated } from './providers/isNotAuthenticated';
import { IsAuthenticated } from './providers/isAuthenticated';
import { ThemeProvider } from './providers/ThemeProvider';
import { Login } from './modules/Login';
import { Dashboard } from './modules/Dashboard';


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route element={<IsNotAuthenticated />}>
          </Route>
          <Route element={<IsAuthenticated />}>
            <Route path='/' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App
