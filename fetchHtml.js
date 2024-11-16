import fetch from "node-fetch";

export default async function handler(req, res) {
  let { url, options } = req.query; // Get the URL from the query parameters
  let args = [null, null];
  // Check if url is defined before decoding
  if (!url) {
    console.error("No 'url' parameter found in the query.");
    res.status(400).json({ error: "Invalid or missing 'url' parameter" });
    return;
  }

  try {
    args[0] = decodeURIComponent(url); // Decode URL
    try {
      if (options) {
        args[1] = JSON.parse(decodeURIComponent(options));
        args[1]["method"] = "GET";
      } else {
        args[1] = { method: "GET" };
      }
    } catch {
      args.length = 1;
    }
    if (url && url.startsWith("http")) {
      // Validate that the URL starts with 'http'
      console.error(args[1]);
      const response = await fetch(...args);
      const text = await response.text();
      // Enable CORS for all origins
      res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allow these HTTP methods
      res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow Content-Type header

      res.status(200).send(text); // Respond with the HTML content
    } else {
      console.error("Invalid URL format:", url);
      res
        .status(400)
        .json({ error: "Invalid 'url' format. It must start with http" });
    }
  } catch (error) {
    console.error("Error fetching URL:", error);
    res.status(500).json({
      error: "Error: Unable to fetch the target URL",
      message: error.message,
    });
  }
}
