import express from "express";
import { protect } from "./middleware.js";

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
  res.send('Follow User Page');
});

// unfollow user
router.post('/:id/unfollow', (req, res) => {
  res.send('Unfollow User Page');
});



export default router;