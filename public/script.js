async function scan(mode) {
    const url = document.getElementById("urlInput").value.trim();
    const detailsDiv = document.getElementById("details");
    const statsDiv = document.getElementById("stats");
    const resultsDiv = document.getElementById("results");
    const loading = document.getElementById("loading");
    
    detailsDiv.innerHTML = "";
    statsDiv.innerHTML = "";
    resultsDiv.innerHTML = "";
    
    if (!url) resultsDiv.innerHTML = "<span class='error'>⚠️ Enter a valid URL</span>";

    loading.style.display = "block";

    try {
        const res = await fetch(`http://localhost:8080/scan/${mode}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ target: url })
        });
        const data = await res.json();
        const scanIcon = mode === "fast" ? "⚡" : "🧠";
        const scanLabel = mode === "fast" ? "Basic Scan" : "Expert Scan";

        detailsDiv.innerHTML = `
            <div class="section">
            <h2>${scanIcon} ${scanLabel} – 📂 Details</h2>
            <pre>⌛ Duration: ${data.duration || "—"}s</pre>
            </div>
        `;

        statsDiv.innerHTML = `
            <div class="section">
            <h2>${scanIcon} ${scanLabel} – 🔓 Ports</h2>
            <p> 
                ${data.otherOpenPorts && data.otherOpenPorts.length > 0 
                ? data.otherOpenPorts.join(", ") 
                : "No suspicious ports"}
            </p>
            </div>
        `;

        resultsDiv.innerHTML = `
            <div class="section">
            <h2>${scanIcon} ${scanLabel} – 🌐 Site</h2>
            <pre>${data.target || "—"}</pre>
            </div>
            <div class="section">
            <h2>${scanIcon} ${scanLabel} – 🔎 Host</h2>
            <pre>${data.host || "—"}</pre>
            </div>
            <div class="section">
            <h2>${scanIcon} ${scanLabel} – 🔎 Whois</h2>
            <pre>${data.whois || "—"}</pre>
            </div>
            <div class="section">
            <h2>${scanIcon} ${scanLabel} – 📡 Dig</h2>
            <pre>${data.dig || "—"}</pre>
            </div>
            <div class="section">
            <h2>${scanIcon} ${scanLabel} – 🛰️ Nmap + 🛡️ Vulnerabilities</h2>
            <pre>${data.nmap || "—"}</pre>
            </div>
        `;
    } catch (e) {
        resultsDiv.innerHTML = "<span class='error'>❌ Error connecting to server</span>";
    }

    loading.style.display = "none";
}