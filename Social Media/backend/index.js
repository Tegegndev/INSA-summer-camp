import app from "./src/home.js";
import authRoutes from "./src/auth.js";

app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
