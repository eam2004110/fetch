const express = require("express");
const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda"); // For running Chrome on serverless environments (e.g., AWS Lambda)

const app = express();
app.use(express.json());

// Function to fetch HTML content using puppeteer-core
async function fetchHtml(url) {
  let browser;
  try {
    const options = {
      headless: true,
      args: chrome.args,
      executablePath: await chrome.executablePath,
      userDataDir: "/tmp/user_data", // Temporary storage for user data in Lambda environments
    };

    browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const htmlContent = await page.content(); // Get the HTML content of the page
    return htmlContent;
  } catch (error) {
    console.error("Error fetching HTML:", error.message); // Log the error message
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// API route to fetch HTML
app.post("/fetch", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const htmlContent = await fetchHtml(url);
    if (htmlContent) {
      return res.json({ html: htmlContent });
    } else {
      return res.status(500).json({ error: "Failed to fetch HTML content" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
