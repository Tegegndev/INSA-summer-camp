import express from "express";

const router = express.Router();

router.get('/profile', (req, res) => {
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