require('dotenv').config();
const express = require('express');
const schedule = require('node-schedule');
const updateDaily = require('./updateDaily');
const updateChart = require('./updateChart');
const Scraper = require('./dataScraper');
const isoMap = new Map(require('./iso3.json'));

const dataJob = schedule.scheduleJob({hour: 23, minute: 58}, updateDaily);
const chartJob = schedule.scheduleJob({hour: 23, minute: 58}, updateChart);

const PORT = process.env.PORT || 5000;

const server = express();

server.get('/', async (_, res) => {
    const result = await Scraper.getDataArray()
    const data = result.map(r => r.replace(/ /g, ''));
    const lu = await Scraper.lastUpdated()
    res.json({
        "confirmed": data[0],
        "recoveries": data[2],
        "deaths": data[1],
        "last_updated": lu
    });
});

server.get('/chart_cases', async (_, res) => {
    res.download(__dirname+'/total_cases_chart.png');
});

server.get('/chart_deaths', async (_, res) => {
    res.download(__dirname+'/total_deaths_chart.png');
});

server.get('/map', async (_, res) => {
    const d = await Scraper.mapCountriesData(await Scraper.getCountriesArray());
    res.send([...d].sort((x,y) => y[1][0] - x[1][0]));
});

server.get('/map2', async (_, res) => {
    const d = await Scraper.mapCountriesDataIso(await Scraper.getCountriesArray());
    res.send([...d].sort((x,y) => y[1][0] - x[1][0]));
});

server.get('/daily', async (_, res) => {
    try {
        const data = await Scraper.getDaily();
        res.json({
            notes: ["The date property is a 13 digits unix timestamp.", "Daily data is updated every day at 23:58PM GMT+0"],
            dailyData: data.sort((x,y) => y.date - x.date)
        });
    }
    catch (e) {
        console.log(`Failed to fetch daily data : ${e}`);
        res.json({error: "Could not fetch daily data."});
    }
    
});

server.get('/countries', async (_, res) => {
    const countries = await Scraper.getCountriesArray()
    res.json({
        countries
    });
});

server.get('/country/:country', async (req, res) => {
    let country = req.params.country;
    if (country) {
        country = country.replace(/\s/g, "");
        const countries = await Scraper.getCountriesArray()
        const query = countries.find(c => c.replace(/\s/g, "") === country);
        if (query) {
            const result = await Scraper.getCountryDataArray(query)
            console.log(result);
            const data = result.map(r => r.replace(/ /g, ''));
            const lu = await Scraper.lastUpdated()
            res.json({
                "country": query,
                "iso3": isoMap.get(query),
                "confirmed": data[0],
                "new_cases": data[1],
                "deaths": data[2],
                "new_deaths": data[3],
                "recoveries": data[4],
                "active_cases": data[5],
                "serious_cases": data[6],
                "tot_cases/1M_pop": data[7],
                "tot_deaths/1M_pop": data[8],
                "total_tests": data[9],
                "tests/1M_pop": data[10],
                "last_updated": lu
            });
        }
        else {
            res.json({
                error: "No info on the provided country"
            });
        }
    }
    else {
        res.json({
            error: "please provide a country"
        });
    }
});

server.get('/*', (_, res) => {
    res.json({
        routes: [
            {
                route: "/",
                desc: "Coronavirus stats worldwide"
            },
            {
                route: "/countries",
                desc: "Available countries"
            },
            {
                route: "/country/:country",
                desc: "Coronavirus stats in the specified country"
            },
            {
                route: "/map",
                desc: "Coronavirus stats in all the available countries mapped in a key-value pair array with the country's name as the key"
            },
            {
                route: "/map",
                desc: "Coronavirus stats in all the available countries mapped in a key-value pair array with the country's ISO_A3 code as the key"
            },
            {
                route: "/chart_cases",
                desc: "A linear chart demonstrating the number of cases x time"
            },
            {
                route: "/chart_deaths",
                desc: "A linear chart demonstrating the number of deaths x time"
            }
        ]
    });
});

server.listen(PORT, () => console.log(`listening on ${PORT}...`));