const fs = require('fs/promises');
const Scraper = require('./dataScraper');

const update = async () => {
    const newRecords = await Scraper.getDataArray();
    const newRecordsObject = {confirmed: newRecords[0], deaths: newRecords[1], date: new Date(new Date(Date.now()).toDateString()).getTime()};
    const buffer = await fs.readFile('daily.json');
    const oldRecords = JSON.parse(buffer);
    oldRecords.push(newRecordsObject);
    fs.writeFile('daily.json', JSON.stringify(oldRecords))
        .then(v => console.log(`Updated daily data : ${new Date(Date.now()).toString()}`))
        .catch(r => console.log(`Failed to update daily data : ${r}`));
} 

module.exports = update;