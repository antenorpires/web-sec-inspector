import express from "express";
import { runScan } from "../services/scan.js";
import { sanitizeUrl } from "../utils/sanitize.js";

const router = express.Router();

router.post("/fast", (req, res) => {
  const target = sanitizeUrl(req.body.target || "");
  runScan(
    target, 
    ``,
    ``,
    ``,
    `nmap -F -Pn -sT --open ${target}`,
    results => res.json(results)
  );
});

router.post("/low", (req, res) => {
  const target = sanitizeUrl(req.body.target || "");
  runScan(
    target, 
    `host -d ${target}`,
    `whois ${target}`,
    `dig DNSKEY +dnssec ${target}`,
    `sudo nmap -F -Pn -sT --open -sV -A -O --script vuln ${target}`,
    results => res.json(results)
  );
});

export default router;
