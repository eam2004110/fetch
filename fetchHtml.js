import fetch from "node-fetch";

export default async function handler(req, res) {
  let { url, options } = req.query; // Extract query parameters
  if (!url) {
    res.status(400).json({ error: "Missing 'url' parameter" });
    return;
  }

  try {
    const targetUrl = decodeURIComponent(url);
    const requestOptions = options
      ? { ...JSON.parse(decodeURIComponent(options)), method: "GET" }
      : { method: "GET" };

    // Add headers to simulate a browser
    requestOptions.headers = {
      ...requestOptions.headers,
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
    };

    // Make the request
    const response = await fetch(targetUrl, requestOptions);
    const text = await response.text();

    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.status(200).send(text); // Send HTML content
  } catch (error) {
    console.error("Error fetching URL:", error);
    res.status(500).json({
      error: "Unable to fetch the URL",
      message: error.message,
    });
  }
}
