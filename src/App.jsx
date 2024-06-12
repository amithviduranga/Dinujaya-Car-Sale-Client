import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import { message } from "antd";
import Register from './pages/Register.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import OwnerDashboard from './pages/owner/dashboard/OwnerDashboard.jsx';

function App() {
  // Set global configuration for the message component
message.config({
  top: 50, // Set the distance from the top
  duration: 3, // Set the duration of the message
});
  return (
    <BrowserRouter>
      <div>
        <ToastContainer />
        
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/admin/dashboard' element={<OwnerDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
