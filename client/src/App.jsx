import { useState, useEffect } from 'react';
import axios from 'axios';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import CreatePost from './components/CreatePost';
import './App.css';

const API_URL = 'http://localhost:5100/api';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts from:', `${API_URL}/posts`);
      const response = await axios.get(`${API_URL}/posts`);
      console.log('Posts fetched successfully:', response.data);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to connect to server. Make sure the backend is running on port 5000.');
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await axios.post(`${API_URL}/posts`, postData);
      setPosts(prevPosts => [response.data, ...prevPosts]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      setPosts(posts.filter(post => post.id !== id));
      setSelectedPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>My Blog</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          New Post
        </button>
      </header>

      <main className="app-main">
        {showCreateForm && (
          <CreatePost 
            onSubmit={handleCreatePost}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {selectedPost ? (
          <BlogPost 
            post={selectedPost}
            onBack={() => setSelectedPost(null)}
            onDelete={handleDeletePost}
          />
        ) : (
          <BlogList 
            posts={posts}
            onSelectPost={setSelectedPost}
          />
        )}
      </main>
    </div>
  );
}

export default App;