import fetch from "node-fetch";

export default async function handler(req, res) {
  let { url } = req.query; // Get the URL from the query parameters

  // Check if url is defined before decoding
  if (!url) {
    console.error("No 'url' parameter found in the query.");
    res.status(400).json({ error: "Invalid or missing 'url' parameter" });
    return;
  }

  try {
    url = decodeURIComponent(url); // Decode URL

    if (url && url.startsWith("http")) {
      // Validate that the URL starts with 'http'
      const response = await fetch(url);
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
