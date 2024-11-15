import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query; // Get the URL from the query parameters

  if (url && url.startsWith("http")) {
    // Ensure URL is provided and starts with "http"
    try {
      const response = await fetch(url);
      const text = await response.text();
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(text);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error: Unable to fetch the target URL");
    }
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Error: Invalid or missing 'url' parameter");
  }
}
