import express from "express";  
import supabase from "./supabase.js";

const app = express();

//check if supabase is working
app.get("/check", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

export default app;