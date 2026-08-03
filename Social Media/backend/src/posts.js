import express from 'express';

const router = express.Router();

// Feed
router.get('/', (req, res) => {
  res.json({ message: 'All posts / feed' });
});

// Create post
router.post('/', (req, res) => {
  const { content } = req.body;
  res.status(201).json({ message: 'Post created', content });
});

// Single post
router.get('/:id', (req, res) => {
  res.json({ message: `Post ${req.params.id}` });
});

// Delete post
router.delete('/:id', (req, res) => {
  res.json({ message: `Post ${req.params.id} deleted` });
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