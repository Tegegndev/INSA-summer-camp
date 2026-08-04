import express from "express";
import { protect } from "./middleware.js";
import { supabaseForUser } from "./supabase.js";

const router = express.Router();

router.get('/profile',protect, (req, res) => {
  const userId = req.user.id; 
  const db = supabaseForUser(req.token);
  db.from('profiles').select('*').eq('id', userId).then(({ data, error }) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(data[0]);
  });
});


// who am I following?
router.get('/following', protect, async (req, res) => {
  const userId = req.user.id;
  const db = supabaseForUser(req.token);

  // step 1: get the ids I'm following
  const { data: follows, error: err1 } =
    await db.from('follows').select('following_id').eq('follower_id', userId);
  if (err1) return res.status(500).json({ error: err1.message });

  // step 2: get the names for those ids
  const ids = [];
  for (let i = 0; i < follows.length; i++) {
    ids.push(follows[i].following_id);
  }
  const { data: users, error: err2 } =
    await db.from('profiles').select('id, username, display_name').in('id', ids);
  if (err2) return res.status(500).json({ error: err2.message });

  res.json(users);
});

//used ai for this logic and tryna understand it
// who follows me
router.get('/followers', protect, async (req, res) => {
  const userId = req.user.id;
  const db = supabaseForUser(req.token);

  // step 1: get the ids that follow me
  const { data: follows, error: err1 } =
    await db.from('follows').select('follower_id').eq('following_id', userId);
  if (err1) return res.status(500).json({ error: err1.message });

  // step 2: get the names for those ids
  const ids = [];
  for (let i = 0; i < follows.length; i++) {
    ids.push(follows[i].follower_id);
  }
  const { data: users, error: err2 } =
    await db.from('profiles').select('id, username, display_name').in('id', ids);
  if (err2) return res.status(500).json({ error: err2.message });

  res.json(users);
});

//follow user
router.post('/:id/follow', protect ,(req, res) => {
  const userIdToFollow = req.params.id;
  const userId = req.user.id; // id authenticated user

  if (!userIdToFollow) {
    return res.status(400).json({ error: 'User ID to follow is required' });
  }

  const db =  supabaseForUser(req.token);
  db.from('follows').insert([{ follower_id: userId, following_id: userIdToFollow }])
    .then(({ data, error }) => {
      if (error) {
        //if error is dupicate show aready following
        if (error.code === '23505') { 
          return res.status(400).json({ error: `You are already following user ${userIdToFollow}` });
        }
        return res.status(500).json({ error: error.message,error_code: error.code });
      }
      res.json({ message: `You are now following user ${userIdToFollow}`, data });
    });
});

// unfollow user
router.post('/:id/unfollow', protect,(req, res) => {
  const userIdToUnfollow = req.params.id;
  const userId = req.user.id; //id authenticated user

  if (!userIdToUnfollow) {
    return res.status(400).json({ error: 'User ID to unfollow is required' });
  }

  const db = supabaseForUser(req.token);
  db.from('follows').delete().eq('follower_id', userId).eq('following_id', userIdToUnfollow)
    .then(({ data, error }) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: `You are no longer following user ${userIdToUnfollow}`, data });
    });
});



export default router;