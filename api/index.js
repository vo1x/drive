// api/index.js
import express from "express";
import router from "./routes/index.js";

const app = express();

app.use(express.json());
app.use("/", router);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export for Vercel
export default app;