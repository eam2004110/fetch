import fetch from "node-fetch";
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
      verflow-x:hidden;
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
  let { url, options } = req.body; // Get the URL from the query parameters
  let args = [null, null];
  // Check if url is defined before decoding
  // Enable CORS for all origins
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allow these HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow Content-Type header

  if (!url) {
    console.error("No 'url' parameter found in the query.");
    res.status(400).json({ error: "Invalid or missing 'url' parameter" });
    return;
  }

  try {
    args[0] = url; // Decode URL
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

    if (url && url.startsWith("http")) {
      // Validate that the URL starts with 'http'
      console.log(...args);
      const response = await fetch(...args);
      const text = await response.text();
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
