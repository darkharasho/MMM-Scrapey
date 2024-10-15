# MMM-Scrapey

Module for MagicMirror, to scrape content from a webpage for display

config.js example:

```javascript
modules: [
    {
        module: "MMM-Scrapey",
        position: "top_bar", // You can choose a different position
        config: {
            url: "https://webscraper.io/test-sites/tables/tables-semantically-correct", // The URL of the page with the table
            updateInterval: 60000, // 1 minute
            cssSelector: "tbody > tr:nth-child(2)"
        }
    }
    ]
```
