import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8080;
const root = path.resolve();

app.use(express.static(path.join(root, "dist")));
app.use(express.static(path.join(root, "public")));
app.use('/docs', express.static(path.join(root, 'docs')));

app.get("*", (req, res) => {
  res.sendFile(path.join(root, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});
