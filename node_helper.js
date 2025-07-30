const NodeHelper = require("node_helper");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
let puppeteer;
try { puppeteer = require("puppeteer"); } catch (e) { puppeteer = null; }

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node helper for module: " + this.name);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FETCH_SCRAPE_DATA") {
            if (payload.waitForSelector && puppeteer) {
                this.fetchDataWithPuppeteer(payload.url, payload.cssSelector, payload.instanceId, payload.browserPath);
            } else {
                this.fetchData(payload.url, payload.cssSelector, payload.instanceId);
            }
        }
    },

    fetchData: function (scrapeURL, cssSelector, instanceId) {
        fetch(scrapeURL)
            .then((response) => response.text())
            .then((body) => {
                const $ = cheerio.load(body);
                const scrapedData = $(cssSelector).html();

                if (!scrapedData) {
                    console.error("[MMM-Scrapey] '" + cssSelector + "' not found in HTML.");
                    this.sendSocketNotification("SCRAPE_DATA", {
                        instanceId: instanceId,
                        data: [["Scrape target not found"]]
                    });
                    return;
                }

                this.sendSocketNotification("SCRAPE_DATA", {
                    instanceId: instanceId,
                    data: scrapedData
                });
            })
            .catch((error) => {
                console.error("[MMM-Scrapey] Error fetching data: ", error);
            });
    },

    fetchDataWithPuppeteer: async function (scrapeURL, cssSelector, instanceId, browserPath) {
        try {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox'],
                executablePath: browserPath || '/usr/bin/chromium-browser'
            });
            const page = await browser.newPage();
            await page.goto(scrapeURL, { waitUntil: 'networkidle2' });
            await page.waitForSelector(cssSelector, { timeout: 15000 });

            console.info(`[MMM-Scrapey][INFO] Selector "${cssSelector}" appeared, starting scrape for instanceId: ${instanceId}`);

            const scrapedData = await page.$eval(cssSelector, el => el.innerHTML);
            await browser.close();

            this.sendSocketNotification("SCRAPE_DATA", {
                instanceId: instanceId,
                data: scrapedData
            });
        } catch (error) {
            console.error("[MMM-Scrapey] Puppeteer error: ", error);
            this.sendSocketNotification("SCRAPE_DATA", {
                instanceId: instanceId,
                data: [["Scrape target not found (puppeteer error)"]]
            });
        }
    }
});
