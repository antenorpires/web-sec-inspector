import { log } from "console";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function writeLog(entry) {
  const logDir = path.join(__dirname, "../../logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const logFile = path.join(logDir, `${new Date().toISOString().slice(0, 10)}.log`);
  const logEntry = `[${new Date().toISOString()}] ${JSON.stringify(entry)}\n`;
  
  fs.appendFileSync(logFile, logEntry, "utf8");
  
  console.log(`[${new Date().toISOString()}] ${JSON.stringify(entry)}`);  
}
