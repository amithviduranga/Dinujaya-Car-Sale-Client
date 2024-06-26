import logo from './logo.svg';
import { BrowserRouter, Routes, Route,useLocation  } from 'react-router-dom';
import Login from './pages/Login.jsx';
import { message } from "antd";
import Register from './pages/Register.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import OwnerDashboard from './pages/owner/dashboard/OwnerDashboard.jsx';
import Main from './pages/global/Main.jsx';
import Bikes from  './pages/global/Bikes.jsx';
import NavigationBar from "./pages/global/components/NavigationBar.jsx";
import './index.css';

function App() {
  // Set global configuration for the message component
message.config({
  top: 50, // Set the distance from the top
  duration: 3, // Set the duration of the message
});


 return (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);
}

function AppContent() {
// Use the useLocation hook to get the current location
const location = useLocation();

// Function to check if the current path contains 'admin'
const isAdminPath = location.pathname.startsWith('/admin');

return (
  <div>
    <ToastContainer />
    {!isAdminPath && <NavigationBar />}
    <Routes>
      <Route path='/' element={<Main />} />
      {/* Global Routes */}
      <Route path='/vehicleCategories/Bikes' element={<Bikes />} />

      {/* Admin Routes */}
      <Route path='/admin/login' element={<Login />} />
      <Route path='/admin/register' element={<Register />} />
      <Route path='/admin/dashboard' element={<OwnerDashboard />} />
    </Routes>
  </div>
);
}

export default App;
