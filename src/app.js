import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import scanRoutes from "./routes/scan.js";
import healthRoutes from "./routes/health.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/scan", scanRoutes);
app.use("/health", healthRoutes);

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running in http://localhost:${PORT}`);
});
