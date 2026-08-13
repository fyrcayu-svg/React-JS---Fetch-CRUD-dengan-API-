import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect halaman utama ("/") langsung ke Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Halaman Login (Berdiri sendiri, tanpa Navbar & efek Layout utama) */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Mengecek apakah user sudah login) */}
        <Route element={<ProtectedRoute />}>
          
          {/* MainLayout (Membungkus halaman dengan Navbar dan Background Kaca) */}
          <Route element={<MainLayout />}>
            
            {/* Halaman-halaman yang akan masuk ke dalam <Outlet /> di MainLayout */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/settings" element={<Settings />} />

          </Route>
          
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;