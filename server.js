import { createServer } from "http";
import fetch from "node-fetch";
const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  const { method, url, headers } = req;

  // Set CORS headers to allow all origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests (OPTIONS)
  if (method === "OPTIONS") {
    res.writeHead(204); // No content
    return res.end();
  }

  if (url.startsWith("/api/fetch/")) {
    const targetUrl = url.slice(11, url.length); // Extract the target URL
    try {
      const response = await fetch(targetUrl);
      const text = await response.text();
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(text);
    } catch (error) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
