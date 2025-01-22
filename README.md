# MMM-Scrapey

Module for [MagicMirror²](https://github.com/MichMich/MagicMirror/), to scrape content from any table on a webpage, choose which rows and columns you want, and how often you want to refresh the display on your mirror.

![Alt text](/img/demo.png "A preview of the MMM-Scrapey module showing bus times.")
![Alt text](/img/demo-2.png "A preview of the MMM-Scrapey module readong from a scrape test page.")

## Installing

### Step 1 - Install the module
```javascript
cd ~/MagicMirror/modules
git clone https://github.com/AndyHazz/MMM-Scrapey.git
cd MMM-Scrapey
npm install
```

### Step 2 - Add module to `~MagicMirror/config/config.js`
Add this configuration into `config.js` file's
```json5
{
    module: "MMM-Scrapey",
    position: "lower_third",
    config: {
        title: "Scrapey module", // Optional - remove or leave empty for no title
        url: "https://webscraper.io/test-sites/tables", // The URL of the page with the table to scrape
        updateInterval: 300, // Refresh time in seconds
        cssSelector: "table", // 'table' should select the first table on the page, or use CSS selectors to be more specific
        tableColumns: [1,3,4], // Specify which columns to display (1-based index)
        tableRows: [1,2,3], // Specify which rows to display (1-based index), leave empty to show all
        showTableHeader: true, // Toggle formatting the first row as a table header
        plainText: true // Strip out any extra HTML and just keep the plain text content
    }
},
```
## Updating
Go to the module’s folder inside MagicMirror modules folder and pull the latest version from GitHub and install:
```
git pull
npm install
```
