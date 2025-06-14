function BlogList({ posts, onSelectPost }) {
  return (
    <div className="blog-list">
      <h2>Blog Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet. Create your first post!</p>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div 
              key={post.id} 
              className="post-card"
              onClick={() => onSelectPost(post)}
            >
              <h3>{post.title}</h3>
              <p className="post-preview">
                {post.content.substring(0, 150)}...
              </p>
              <div className="post-meta">
                <span>By {post.author}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogList;