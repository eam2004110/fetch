import { createServer } from "http";
import fetch from "node-fetch";
const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  const { method, url, headers } = req;

  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.writeHead(204);
    res.end();
    return;
  }
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; media-src *; img-src *; connect-src *"
  );
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
    console.log(req.url, req.method);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
