import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/blogApi';
import AuthContext from '../context/AuthContext';
import '../styles/CreateBlog.css';

function CreateBlog() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to create a blog.');
      return;
    }

    try {
      await API.post('/blogs/', form);
      navigate('/');
    } catch (err) {
      setError('Failed to create blog.');
    }
  };

  return (
    <div className="create-blog-page">
      <h2>Create a Blog</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required />
        <label htmlFor="content">Content:</label>
        <textarea id="content" name="content" rows="8" value={form.content} onChange={handleChange} required />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Publish</button>
      </form>
    </div>
  );
}

export default CreateBlog;
