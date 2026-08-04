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
    const { email, password, password2, name ,username, bio } = req.body ?? {};
    const avatar_url = req.body.avatar_url ??  "https://img.icons8.com/?size=100&id=23244&format=png&color=000000"; 

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
    if (!data.user) {
        return res.json({ error: "User not created" });
    }
    console.log("User created:", data.user);
    //lets enter username,display_name,bio and avator url to profile table
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, username, display_name: name }]);
        
    if (profileError) {
        return res.json({ error: profileError.message });
    }
    res.json({ message: "registration successful verfy ur email address", data });
});
 


export default router;