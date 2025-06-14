const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Path to data file
const DATA_FILE = path.join(__dirname, '../data/posts.json');

// Initialize data directory and file
const initializeDataFile = async () => {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    // Check if file exists, if not create it with default data
    try {
      await fs.access(DATA_FILE);
    } catch {
      const defaultPosts = [
        {
          id: 1,
          title: 'Welcome to My Blog',
          content: 'This is the first blog post. Welcome to our simple blog!',
          author: 'Admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Getting Started with React',
          content: 'React is a powerful library for building user interfaces...',
          author: 'John Doe',
          createdAt: new Date().toISOString()
        }
      ];
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultPosts, null, 2));
    }
  } catch (error) {
    console.error('Error initializing data file:', error);
  }
};

// Helper functions to read/write data
const readPosts = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
};

const writePosts = async (posts) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Error writing posts:', error);
  }
};

// Initialize on startup
initializeDataFile();

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await readPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// GET single post
router.get('/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' });
  }
});

// POST new post
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const posts = await readPosts();
    const newPost = {
      id: Date.now(),
      title,
      content,
      author: author || 'Anonymous',
      createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    await writePosts(posts);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

// DELETE post
router.delete('/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    posts.splice(postIndex, 1);
    await writePosts(posts);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
});

module.exports = router;