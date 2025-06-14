import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/blogApi';
import AuthContext from '../context/AuthContext';
import './EditBlog.css';

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`blogs/${id}/`);
        if (user?.username !== res.data.author) {
          setError('You are not authorized to edit this blog.');
        } else {
          setForm({ title: res.data.title, content: res.data.content });
        }
      } catch (err) {
        setError('Failed to fetch blog.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`blogs/${id}/`, form);
      navigate(`/blogs/${id}`);
    } catch (err) {
      setError('Failed to update blog.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="edit-blog-page">
      <h2>Edit Blog</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          id="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="content">Content:</label>
        <textarea
          name="content"
          id="content"
          rows="10"
          value={form.content}
          onChange={handleChange}
          required
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditBlog;
