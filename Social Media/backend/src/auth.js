import express from "express";


const router = express.Router();



router.get('/login', (req, res) => {
  res.send('Login Page');
});

router.get('/register', (req, res) => {
  res.send('Register Page');
});


export default router;