Module.register("MMM-Scrapey", {
    // Default module config
    defaults: {
        updateInterval: 60000, // 1 minute
        url: "https://webscraper.io/test-sites/tables/tables-semantically-correct", // URL to scrape from
        cssSelector: "table", // Selector for the output
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.scrapeData = null; // Initially no data
        this.getData();
        // Schedule updates
        setInterval(() => {
            this.getData();
        }, this.config.updateInterval);
    },

    getData: function () {
        console.log("Fetching: " + this.config.url);
        console.log("CSS selector: " + this.config.cssSelector);
        this.sendSocketNotification("FETCH_SCRAPE_DATA", {
            url: this.config.url,
            cssSelector: this.config.cssSelector
        });
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "SCRAPE_DATA") {
            this.scrapeData = payload;
            console.log(this.scrapeData); // Debug: Check the received data
            this.updateDom(); // Trigger the DOM update
        }
    },

    // Override the getDom function to display the data
    getDom: function () {
        var wrapper = document.createElement("div");

        // Check if data is available
        if (!this.scrapeData) {
            wrapper.innerHTML = "Loading data...";
            return wrapper;
        }

        // Prevent MagicMirror from sanitizing the HTML
        wrapper.innerHTML = this.scrapeData;  // Set inner HTML directly, render full HTML
        return wrapper;
    }
});
