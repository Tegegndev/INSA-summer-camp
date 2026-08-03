import express from "express";
import supabase from "./supabase.js";

//check auth
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized login bel" });
    }
    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        return res.status(401).json({ error: "Unauthorized login bel"  });
    }
    req.token = token;
    req.user = data.user;
    next();
};

export { protect };


// is eail verfied
const isEmailVerified = (req, res, next) => {
    const user = req.user;
    if (!user.email_confirmed_at) {
        return res.status(403).json({ error: "Email not verified" });
    }
    next();
};

export { isEmailVerified };

