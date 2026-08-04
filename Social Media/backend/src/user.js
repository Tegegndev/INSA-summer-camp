import express from "express";
import { protect } from "./middleware.js";
import { supabaseForUser } from "./supabase.js";

const router = express.Router();

router.get('/profile',protect, (req, res) => {
  res.send('User Profile Page');
});

router.get('/following', (req, res) => {
  res.send('User Following Page ');
});


//followers
router.get('/followers', (req, res) => {
  res.send('User Followers Page');
});

//follow user
router.post('/:id/follow', (req, res) => {
  const userIdToFollow = req.params.id;
  const userId = req.user.id; // id authenticated user

  if (!userIdToFollow) {
    return res.status(400).json({ error: 'User ID to follow is required' });
  }

  const db = supabaseForUser(req.token);
  db.from('follows').insert([{ follower_id: userId, following_id: userIdToFollow }])
    .then(({ data, error }) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: `You are now following user ${userIdToFollow}`, data });
    });
});

// unfollow user
router.post('/:id/unfollow', (req, res) => {
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