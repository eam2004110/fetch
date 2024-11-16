import fetch from "node-fetch";

const cookieJar = {}; // Store cookies for different URLs

// Helper function to parse and store cookies
function updateCookies(url, setCookieHeader) {
  if (!setCookieHeader) return;
  const domain = new URL(url).hostname;

  // Initialize cookies for the domain
  cookieJar[domain] = cookieJar[domain] || {};

  setCookieHeader.forEach((cookieStr) => {
    const [cookie] = cookieStr.split(";"); // Take the cookie before the first ';'
    const [key, value] = cookie.split("=");
    cookieJar[domain][key.trim()] = value.trim();
  });
}

// Helper function to retrieve cookies for a domain
function getCookies(url) {
  const domain = new URL(url).hostname;
  if (!cookieJar[domain]) return "";
  return Object.entries(cookieJar[domain])
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
}

export default async function handler(req, res) {
  if (req.method == "GET") {
    res.status(200).send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <input type="text" placeholder="input a url" id="urlInput" />
    <div id="content"></div>
  </body>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background-color: black;
      color: white;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: bolder;
    }
    #urlInput {
      height: 50px;
    }
    #content {
      min-width: 300px;
      min-height: 300px;
      max-width: calc(100vw - 10px);
      max-height: calc(100vh - 110px);
      border: 1px solid aqua;
      overflow-x:hidden;
      overflow-y:auto;
    }
  </style>
  <script>
    const urlInput = document.getElementById("urlInput");
    const content = document.getElementById("content");
    urlInput.onkeydown = async () => {
      if (!urlInput.value.startsWith("https:")) return;
      try {
        const url = urlInput.value.trim();
        urlInput.value = "";
        content.innerText = "";
        const resp = await fetch(
          "https://fetch-meds-projects-8ac21d67.vercel.app/fetchHtml",
          {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ url }),
          }
        );
        let data = await resp.text();
        content.innerText = data;
      } catch (e) {
        console.error(e);
      }
    };
  </script>
</html>
`);
    return;
  } else if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  let { url, options } = req.body;

  // Enable CORS for all origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (!url) {
    console.error("No 'url' parameter found in the query.");
    res.status(400).json({ error: "Invalid or missing 'url' parameter" });
    return;
  }

  try {
    // Default options
    options = options || { headers: {}, method: "GET" };
    options.headers = options.headers || {};

    // Add cookies to the request
    options.headers["Cookie"] = getCookies(url);

    // Add other default headers
    options.headers["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";
    options.headers["Accept"] =
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8";
    options.headers["Accept-Language"] = "en-US,en;q=0.9";
    options.headers["Connection"] = "keep-alive";

    if (url.startsWith("http")) {
      console.log("Fetching:", url, "with options:", options);
      const response = await fetch(url, options);

      // Update cookies from the response
      const setCookieHeader = response.headers.raw()["set-cookie"];
      updateCookies(url, setCookieHeader);

      const text = await response.text();
      res.status(200).send(text);
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
