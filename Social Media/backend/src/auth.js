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

router.post('/register', async (req, res) => {
    const { email, password, password2, name ,username,} = req.body ?? {};

    if (!email || !password || !password2 || !name || !username) {
        return res.json({ error: " miss fields " });
    }
    if( password !== password2){
        return res.json({ error: " password not match " });
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        
        options: {
                data: { name, username },  
            },
  
    });

    if (error) {
        return res.json({ error: error.message });
    }

    res.json({ message: "Registration successful Verfiy ur email address", data });
});


export default router;