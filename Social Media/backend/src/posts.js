import express from 'express';
import { protect } from './middleware.js';
import { supabaseForUser } from './supabase.js';

const router = express.Router();
router.use(protect);  // hullum post route login  require endiaderg

// Feed
router.get('/', async (req, res) => {
    const db = supabaseForUser(req.token);
    const { data, error } = await db.from('posts').select('*');

    if (error) {
        return res.json({ error: error.message });
    }
    if (!data || data.length === 0) {
        return res.json({ message: 'No posts found' });
    }
    res.json(data);
});



// Create post
router.post('/', async (req, res) => {
    
  const { content } = req.body ?? {}; 
  const userId = req.user.id; // Get the user ID from the authenticated user
  const imageurl = req.body.imageurl ?? null; // Get the image URL from the request body (if provided)
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  const db = supabaseForUser(req.token);
  const { data, error } = await db.from('posts').insert([{ content, user_id: req.user.id }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'Post created', data });
});

// Single post
router.get('/:id', (req, res) => {
  const postId = req.params.id;
  if (!postId) {
    return res.json({ error: 'Post ID is required' });
  }
  const check_supabase =  supabaseForUser(req.token);
  check_supabase.from('posts').select('*').eq('id', postId).then(({ data, error }) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(data[0]);
  });
});

// Update post
router.put('/:id', (req, res) => {
  res.json({ message: `Post ${req.params.id}` });
});

// Delete post
router.delete('/:id', async (req, res) => {
  const db = supabaseForUser(req.token);
  const { data, error } = await db
    .from('posts')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)   // only delete your own
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Post not found or not yours' });
  }
  res.json({ message: 'Post deleted', deleted: data[0] });
});

//like post
router.post('/:id/like', (req, res) => {
  res.json({ message: `Post ${req.params.id} liked` });
});

//unlike post
router.post('/:id/unlike', (req, res) => {
  res.json({ message: `Post ${req.params.id} unliked` });
});

export default router;