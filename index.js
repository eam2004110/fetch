import { createServer } from "http";
import { launch } from "puppeteer-core";
import {
  args as _args,
  executablePath as _executablePath,
} from "chrome-aws-lambda"; // For running Chrome on cloud platforms like AWS Lambda

// Fetch HTML content using puppeteer-core and chrome-aws-lambda
async function fetchHtml(url) {
  let browser;
  try {
    const options = {
      headless: true,
      args: _args,
      executablePath: await _executablePath,
      userDataDir: "/tmp/user_data", // Temporary storage for user data in serverless environments
    };

    browser = await launch(options);
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const htmlContent = await page.content(); // Get the HTML content of the page
    return htmlContent;
  } catch (error) {
    console.error("Error fetching HTML:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// HTTP server to handle requests
const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/fetch") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const { url } = JSON.parse(body);
        if (!url) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "URL is required" }));
        }

        const htmlContent = await fetchHtml(url);
        if (htmlContent) {
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ html: htmlContent }));
        } else {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ error: "Failed to fetch HTML content" })
          );
        }
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

// Server listens on a port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
