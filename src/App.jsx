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
import Bikes from  './pages/global/vehicleCategories/Bikes.jsx';
import NavigationBar from "./pages/global/components/NavigationBar.jsx";
import './index.css';
import Vans from './pages/global/vehicleCategories/Vans.jsx';
import ThreeWheelers from './pages/global/vehicleCategories/ThreeWheelers.jsx';
import Lorries from './pages/global/vehicleCategories/Lorries.jsx';
import Cars from './pages/global/vehicleCategories/Cars.jsx';
import VehicleDetail from './pages/global/VehicleDetail.jsx'
import PostAnAdd from './pages/global/PostAnAdd.jsx'
import PayForAdvertiesment from './pages/global/PayForAdvertiesment.jsx';

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
      <Route path='/vehicleCategories/Vans' element={<Vans />} />
      <Route path='/vehicleCategories/Three-Wheels' element={<ThreeWheelers/>} />
      <Route path='/vehicleCategories/lorries' element={<Lorries/>} />
      <Route path='/vehicleCategories/cars' element={<Cars/>} />
      <Route path="/vehicle/:id" element={<VehicleDetail />} />
      <Route path="/post-ad/" element={<PostAnAdd />} />
      <Route path="//payment-success" element={<PayForAdvertiesment />} />

      

      {/* Admin Routes */}
      <Route path='/admin/login' element={<Login />} />
      <Route path='/admin/register' element={<Register />} />
      <Route path='/admin/dashboard' element={<OwnerDashboard />} />
    </Routes>
  </div>
);
}

export default App;
