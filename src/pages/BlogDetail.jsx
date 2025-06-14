import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import API from '../api/blogApi';
import ReactMarkdown from 'react-markdown';
import '../styles/BlogDetail.css';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`blogs/${id}/`);
        setBlog(res.data);
      } catch (err) {
        setError('Could not fetch blog.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    try {
      await API.delete(`blogs/${id}/`);
      navigate('/');
    } catch (err) {
      setError('Delete failed. You may not have permission.');
    }
  };

  if (loading) return <p>Loading blog...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!blog) return <p>Blog not found.</p>;

  const isAuthor = user?.username === blog.author;

  return (
    <div className="blog-detail">
      <h2>{blog.title}</h2>
      <p><strong>By:</strong> {blog.author}</p>
      <hr />

      <div className="blog-content">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      {isAuthor && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => navigate(`/edit/${id}`)}>Edit</button>
          <button
            onClick={handleDelete}
            style={{
              marginLeft: '1rem',
              color: 'white',
              backgroundColor: 'red',
              border: 'none',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/')} style={{ padding: '6px 12px' }}>
          ← Back to All Blogs
        </button>
      </div>
    </div>
  );
}

export default BlogDetail;
