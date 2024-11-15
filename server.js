// server.js
import { createServer } from "http";
import https from "https";
import fetch from "node-fetch";
const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  const { method, url, headers } = req;

  if (url.startsWith("/http")) {
    const targetUrl = url.slice(1, url.length);
    try {
      const response = await fetch(targetUrl);
      let string = response.text();
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(string);
    } catch {
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
