import { Link } from 'react-router-dom';
import '../styles/BlogCard.css';

function BlogCard({ blog }) {
  return (
    <div className="blog-card">
      <h3>{blog.title}</h3>
      <p>{blog.content.slice(0, 100)}...</p>
      <Link to={`/blogs/${blog.id}`}>Read More</Link>
    </div>
  );
}

export default BlogCard;
