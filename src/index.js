import express from "express";

import router from "./routes/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/", router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// module.exports = app;
