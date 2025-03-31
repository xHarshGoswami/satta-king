import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './user/screens/Home';
import Chart from './components/Chart';
import ContactUs from './user/screens/ContactUs';
import AdminPage from './pages/AdminPage';
import CustomChart from './user/screens/CustomChart';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './admin/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage editingId={null} onSuccess={() => { }} />
            </ProtectedRoute>
          }
        />
        <Route path="/customchart" element={<CustomChart />} />
      </Routes>
    </Router>
  );
}

export default App;
