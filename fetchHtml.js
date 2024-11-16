import fetch from "node-fetch";

export default async function handler(req, res) {
  let { url, options } = req.body; // Get the URL from the query parameters
  let args = [null, null];
  // Check if url is defined before decoding
  if (!url) {
    console.error("No 'url' parameter found in the query.");
    res.status(400).json({ error: "Invalid or missing 'url' parameter" });
    return;
  } else if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  try {
    args[0] = url; // Decode URL
    try {
      if (!options) {
        options = { headers: {}, method: "GET" };
      }
      args[1] = options;
      args[1]["headers"] ? "" : (args[1]["headers"] = {});
      args[1]["headers"]["User-Agent"] =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";
      args[1]["headers"]["Cookie"] = "cookie";
      args[1]["headers"]["Accept"] =
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8";
      args[1]["headers"]["Accept-Language"] = "en-US,en;q=0.9";
      args[1]["headers"]["Connection"] = "keep-alive";
      args[1]["headers"]["Upgrade-Insecure-Requests"] = "1";
      args[1]["headers"]["Cache-Control"] = "max-age=0";
      args[1]["method"] = "GET";
    } catch {
      args.length = 1;
    }
    if (url && url.startsWith("http")) {
      // Validate that the URL starts with 'http'
      console.log(...args);
      const response = await fetch(...args);
      const text = await response.text();
      // Enable CORS for all origins
      res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allow these HTTP methods
      res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow Content-Type header

      res.status(200).send(text); // Respond with the HTML content
      res.end("done");
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
