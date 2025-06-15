// BlogList.jsx
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/blogApi';
import '../styles/BlogList.css';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();

    const token = localStorage.getItem('access');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const username = decoded?.username || null;
        setCurrentUser(username);
        console.log('Logged in as:', username);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await API.get('/blogs/');
      setBlogs(res.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmed) return;

    try {
      await API.delete(`/blogs/${id}/`);
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    } catch (err) {
      console.error('Failed to delete blog:', err);
      alert('Error deleting blog');
    }
  };

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="blog-list">
      <h2>All Blogs</h2>
      {blogs.map((blog) => {
        const authorUsername = blog.author_username;
        const isOwner = currentUser === authorUsername;

        return (
          <div key={blog.id} className="blog-card">
            <h3>{blog.title}</h3>
            <p>
              {blog.content.length > 150
                ? blog.content.substring(0, 150) + '...'
                : blog.content}
            </p>
            <p>
              <strong>Author:</strong> {authorUsername}
            </p>

            <Link to={`/blogs/${blog.id}`} className="read-more-link">
              Read More
            </Link>

            {isOwner && (
              <div className="blog-actions">
                <button onClick={() => navigate(`/blogs/${blog.id}/edit`)}>Edit</button>
                <button onClick={() => handleDelete(blog.id)} style={{ marginLeft: '8px' }}>
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BlogList;
