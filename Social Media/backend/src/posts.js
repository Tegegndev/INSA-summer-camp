import express from 'express';
import { protect } from './middleware.js';
import { supabaseForUser } from './supabase.js';

const router = express.Router();
router.use(protect);  // hullum post route login  require endiaderg

// Feed
router.get('/', async (req, res) => {
    const db = supabaseForUser(req.token);
    const { data, error } = await db.from('posts')
      .select('*, user_id, created_at, likes:likes(count)')
      .order('created_at', { ascending: false });

    if (error) {
        return res.json({ error: error.message });
    }
    if (!data || data.length === 0) {
        return res.json({ message: 'No posts found' });
    }

    const ids = [...new Set(data.map((p) => p.user_id))];
    const { data: authors, error: authorError } = await db
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', ids);
    if (authorError) return res.json({ error: authorError.message });

    const profileById = new Map((authors ?? []).map((a) => [a.id, a]));
    const result = data.map((p) => ({
      ...p,
      author: p.user_id ? profileById.get(p.user_id) ?? null : null,
    }));

    res.json(result);
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
  res.json({ message: `Post ${req.params.id} i will implement be kirbu` });
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
router.post('/:id/like', async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  if (!postId) {
    return res.json({ error: 'Post ID is required' });
  }
  // check if the user has already liked the post
  const db = supabaseForUser(req.token);
  {
    const { data, error } = await db
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error checking likes:', error);
      return res.status(500).json({ error: error.message });
    }
    if (data && data.length > 0) {
      // user alrdy liked  so let  unlike
      const { deleted, error } = await db
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
        .select();
      if (error) {
        console.error('Error removing like:', error);
        return res.status(500).json({ error: error.message });
      }
      return res.json({ status: 'unliked', message: `You unliked post ${postId}`, postId, removed: deleted?.[0] ?? null });
    }
  }
// if not liked yet, then like it
  const { data, error } = await db
    .from('likes')
    .insert([{ post_id: postId, user_id: userId }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ status: 'liked', message: `You liked post ${postId}`, postId, like: data?.[0] ?? null });
});


export default router;