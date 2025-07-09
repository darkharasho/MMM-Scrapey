const NodeHelper = require("node_helper");
const https = require("https");
const cheerio = require("cheerio");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node helper for module: " + this.name);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "FETCH_SCRAPE_DATA") {
            this.fetchData(payload.url, payload.cssSelector, payload.instanceId);
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
    }
});
