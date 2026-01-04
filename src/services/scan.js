import { exec } from "child_process";
import { writeLog } from "../utils/logs.js";

export function runScan(target, hostCommand, whoisCommand, digCommand, nmapCommand, callback) {
  const results = { target, host: "", whois: "", dig: "", nmap: "" };
  const scanId = Date.now();
  const startTime = Date.now();

  writeLog({ event: "scan_started", request_id: scanId, target });

  if (hostCommand) {
    exec(hostCommand, (err1, stdout1, stderr1) => {
      results.host = err1 ? `Error: ${err1.message}` : stdout1;
      if (err1 != null) writeLog({ event: "host_error", target, error: err1 });
      if (stderr1) writeLog({ event: "host_error", target, error: stderr1 });
    });
  } else {
    hostCommand = "";
  }

  if (whoisCommand) {
    exec(whoisCommand, (err2, stdout2, stderr2) => {
      results.whois = err2 ? `Error: ${err2.message}` : stdout2;
      if (err2 != null) writeLog({ event: "whois_error", target, error: err2 });
      if (stderr2) writeLog({ event: "whois_error", target, error: stderr2 });
    });
  } else {
    whoisCommand = "";
  }

  if (digCommand) {
    exec(digCommand, (err3, stdout3, stderr3) => {
      results.dig = err3 ? `Error: ${err3.message}` : stdout3;
      if (err3 != null) writeLog({ event: "dig_error", target, error: err3 });
      if (stderr3) writeLog({ event: "dig_error", target, error: stderr3 });
    });
  } else {
    digCommand = "";
  }

  if (nmapCommand) {
    exec(nmapCommand, (err4, stdout4, stderr4) => {
      results.nmap = err4 ? `Error: ${err4.message}` : stdout4;
      if (err4 != null) writeLog({ event: "nmap_error", target, error: err4 });
      if (stderr4) writeLog({ event: "nmap_error", target, error: stderr4 });
      
      const portLines = results.nmap.split("\n").filter(line => line.match(/^\d+\/tcp\s+open/));
      const openPorts = portLines.map(line => line.split("/")[0]);
      const otherPorts = openPorts.filter(port => port !== "80" && port !== "443");
      results.openPorts = openPorts;
      results.otherOpenPorts = otherPorts;

      results.duration = (Date.now() - startTime) / 1000;
      
      writeLog({ event: "scan_finished", request_id: scanId, target, duration: results.duration });

      callback(results);
    });
  } else {
    nmapCommand = "";
  }
}
