import fetch from "node-fetch";

export default async function handler(req, res) {
  let { url, options } = req.query; // Extract query parameters
  let t = await fetch("https://pixabay.com/images/search/sky/", {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      priority: "u=0, i",
      "sec-ch-ua":
        '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  });
  t = await t.text();
  res.status(200).send(t);
  return;
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
