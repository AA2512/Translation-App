const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://cloud.google.com/translate/docs/languages";

async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);

    // Select all the list items in plainlist class
    const listItems = $("tr");

    console.log(listItems);
    // Stores data for all countries

    const languages = [];
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // Object holding data for each country/jurisdiction
      const launage = { name: "", iso3: "" };
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      launage.name = $(el).find("td").text();
      let str = launage.name;
      if (str.length > 0) {
        str = str.slice(0, -2);
      }
      launage.name = str;
      //   launage.iso3 = $(el).children("td code").text();
      launage.iso3 = $(el).find("code").text();
      // Populate languages array with launage data
      languages.push(launage);
    });
    // Logs languages array to the console
    console.log(languages);
    // Write languages array in languages.json file
    fs.writeFile(
      "languages.json",
      JSON.stringify(languages, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Successfully written data to file");
      }
    );
  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
scrapeData();
