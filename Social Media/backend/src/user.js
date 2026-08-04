import express from "express";
import { protect } from "./middleware.js";
import { supabaseForUser } from "./supabase.js";

const router = express.Router();

router.get('/profile',protect, (req, res) => {
  res.send('User Profile Page');
});

router.get('/following', protect, (req, res) => {
   const userId = req.user.id; //
    const db = supabaseForUser(req.token);
    db.from('follows').select('following_id').eq('follower_id', userId)
    .then(({ data, error }) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(data);
    });
 
});


//followers
router.get('/followers', protect, (req, res) => {
  res.send('User Followers Page');
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