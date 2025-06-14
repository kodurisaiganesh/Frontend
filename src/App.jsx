import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import EditBlog from './pages/EditBlog';
import CreateBlog from './pages/CreateBlog';
import Login from './pages/Login';
import Register from './pages/Signup';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/blogs" element={<BlogList />} /> {/* ✅ This line fixes the error */}
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
