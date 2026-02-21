import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Importamos o Navigate
import { Login } from "./modules/Login"; 
import { Dashboard } from "./modules/Dashboard";
import { Register } from "./modules/Register";
import "./App.css";

function App() {
  return (
    <Router>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
    </Router>
  )
}

export default App