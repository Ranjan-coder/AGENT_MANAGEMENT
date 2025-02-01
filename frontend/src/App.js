import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './page/Dashboard';
import AddAgentForm from './page/AddAgentForm';

function App() {
  return (
    <>
    <Routes>
    <Route path="/" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/agent" element={<AddAgentForm />} />
    </Routes>
      
    </>
  );
}

export default App;
