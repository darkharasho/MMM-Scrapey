const NodeHelper = require("node_helper");
const https = require("https");
const cheerio = require("cheerio");

console.log("MMM-Scrapey node helper is starting...");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node helper for module: " + this.name);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FETCH_SCRAPE_DATA") {
            console.log("Fetching from: " + payload.url); // Log the URL
            console.log("Using CSS selector: " + payload.cssSelector); // Log the CSS selector
            this.fetchData(payload.url, payload.cssSelector);
        }
    },

    fetchData: function (scrapeURL, cssSelector) {
        fetch(scrapeURL)
            .then((response) => response.text())
            .then((body) => {
                const $ = cheerio.load(body);
                const scrapedData = $(cssSelector).html();

                if (!scrapedData) {
                    console.error(cssSelector + " not found in HTML.");
                    // Handle the case where the selector doesn't match anything
                    return [["Scrape target not found"]];
                }

                console.log(scrapedData); // Log the scraped data
                this.sendSocketNotification("SCRAPE_DATA", scrapedData);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }
});

