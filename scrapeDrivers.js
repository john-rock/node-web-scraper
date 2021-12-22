const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require("fs");
const json2csv = require("json2csv").Parser;
const { table } = require('console');

async function scraper() {
  const results = await request.get('https://www.racing-reference.info/active-drivers/');

  const $ = cheerio.load(results);

  const scrapedData = [];

  $('.tb > tbody > tr').each((i, el) => {

    if (i === 0) return true;

    const tableRow = $(el).find('td.dInfo');

    const driver = $(tableRow[0]).text().trim();

    const driverRow = { driver };

    scrapedData.push(driverRow);
    console.log(scrapedData);
  })

  const j2cp = new json2csv()
  const csv = j2cp.parse(scrapedData);
  fs.writeFileSync('./drivers.csv', csv, "utf-8")
  
}

scraper();