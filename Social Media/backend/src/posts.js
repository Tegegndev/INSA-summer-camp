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
    return res.status(400).json({ error: 'Post ID is required' });
  }

  const db = supabaseForUser(req.token);

  // 1. check if the user has already liked the post
  const { data: existing, error: checkError } = await db
    .from('likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId);

  if (checkError) {
    console.error('Error checking likes:', checkError);
    return res.status(500).json({ error: checkError.message });
  }

  // 2. already liked -> unlike
  if (existing && existing.length > 0) {
    const { data: removed, error: removeError } = await db
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .select();

    if (removeError) {
      console.error('Error removing like:', removeError);
      return res.status(500).json({ error: removeError.message });
    }
    return res.json({
      status: 'unliked',
      message: `You unliked post ${postId}`,
      postId,
      removed: removed[0],
    });
  }

  // 3. not liked yet -> like
  const { data: created, error: createError } = await db
    .from('likes')
    .insert([{ post_id: postId, user_id: userId }])
    .select();

  if (createError) {
    return res.status(500).json({ error: createError.message });
  }
  res.json({
    status: 'liked',
    message: `You liked post ${postId}`,
    postId,
    like: created[0],
  });
});


export default router;