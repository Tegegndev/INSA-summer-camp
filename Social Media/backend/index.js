import app from "./src/home.js";
import authRoutes from "./src/auth.js";
import postRoutes from "./src/posts.js";
import userRoutes from "./src/user.js";


app.use(express.json());
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
