import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, logoutUser, loading } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-right">
        <Link to="/">Home</Link>

        {!loading && user && (
          <Link to="/create">Create</Link>
        )}

        {!loading ? (
          user ? (
            <>
              <span style={{ margin: '0 10px' }}>Welcome, {user.username}</span>
              <button onClick={logoutUser}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
