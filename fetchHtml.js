import fetch from "node-fetch";
import http from "http";
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; media-src *; img-src *; connect-src *"
  );
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.method == "GET") {
    res.writeHead(200);
    res.end(`<!DOCTYPE html>
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
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed. Use POST." }));
    return;
  }
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    try {
      const parsedBody = JSON.parse(body);
      let { url, options } = parsedBody;
      let args = [null, null];
      if (!url) {
        console.error("No 'url' parameter found in the query.");
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.parse({ error: "Invalid or missing 'url' parameter" }));
        return;
      }
      args[0] = url;
      if (!options) {
        options = { method: "GET" };
      }
      args[1] = options;
      if (url && url.startsWith("http")) {
        const response = await fetch(...args);
        const text = await response.text();
        res.writeHead(200);
        res.end(text);
      } else {
        console.error("Invalid URL format:", url);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.parse({ error: "Invalid 'url' format. It must start with http" })
        );
      }
    } catch (error) {
      console.error("Error fetching URL:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.parse({
          error: "Error: Unable to fetch the target URL",
          message: error.message,
        })
      );
    }
  });
});
server.listen(PORT);
