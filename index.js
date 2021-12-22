const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require("fs");
const json2csv = require("json2csv").Parser;

async function scraper() {

  const url = 'https://www.racing-reference.info/standings/2020/W/';

  const results = await request.get(url);

  const $ = cheerio.load(results);

  const scrapedData = [];

  // Select each row to be scraped
  $('.standingsTbl > tbody > tr').each((i, el) => {

    if (i === 0) return true;

    const tableRow = $(el).find('td');

    // Get data for column names
    const driver = $(tableRow[1]).text().trim();
    const starts = $(tableRow[2]).text();
    const wins = $(tableRow[3]).text();
    const top5 = $(tableRow[4]).text();
    const top10 = $(tableRow[5]).text();

    // Set data for columns
    const driverRow = { driver, starts, wins, top5, top10 };

    // Push data to array
    scrapedData.push(driverRow);

  })

  const j2cp = new json2csv();
  const csv = j2cp.parse(scrapedData);

  // Set output file
  fs.writeFileSync('./2020.csv', csv, "utf-8");

  // Log scrapped data for testing
  console.log(scrapedData);
}

scraper();