function BlogPost({ post, onBack, onDelete }) {
  return (
    <div className="blog-post">
      <div className="post-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Posts
        </button>
        <button 
          className="btn btn-danger"
          onClick={() => onDelete(post.id)}
        >
          Delete Post
        </button>
      </div>
      
      <article>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By {post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

export default BlogPost;