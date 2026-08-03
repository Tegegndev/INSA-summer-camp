import express from "express";
import supabase from "./supabase.js";


const router = express.Router();


router.post('/login', async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
        return res.json({ error: " no email OR password " });
  }
    const{data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (error) {
        return res.json({ error: error.message });
    }
    res.json({ message: "Login successful", data });

});

router.get('/register', (req, res) => {
  res.send('Register Page');
});


export default router;