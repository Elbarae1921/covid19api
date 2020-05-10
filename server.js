require('dotenv').config();
const express = require('express');
const Scraper = require('./dataScraper');

const PORT = process.env.PORT || 5000;

const server = express();

server.get('/', (req, res) => {
    Scraper.getDataArray().then(result => {
        const data = result.map(r => r.replace(/ /g, ''));
        Scraper.lastUpdated()
            .then(lu => {
                res.json({
                    "confirmed": data[0],
                    "recoveries": data[2],
                    "deaths": data[1],
                    "last_updated": lu
                });
            });    
    })
});

server.get('/map', async (req, res) => {
    const d = await Scraper.mapCountriesData(await Scraper.getCountriesArray());
    res.send([...d]);
});

server.get('/countries', (req, res) => {
    Scraper.getCountriesArray()
        .then(countries => {
            res.json({
                countries
            });
        });
})

server.get('/:country', (req, res) => {
    let country = req.params.country;
    if (country) {
        country = country.replace(/\s/g, "");
        Scraper.getCountriesArray()
            .then(countries => {
                const query = countries.find(c => c.replace(/\s/g, "") === country);
                if (query) {
                    Scraper.getCountryDataArray(query)
                        .then(result => {
                            const data = result.map(r => r.replace(/ /g, ''));
                            Scraper.lastUpdated()
                                .then(lu => {
                                    res.json({
                                        "country": query,
                                        "confirmed": data[0],
                                        "new_cases": data[1],
                                        "deaths": data[2],
                                        "new_deaths": data[3],
                                        "recoveries": data[4],
                                        "active_cases": data[5],
                                        "last_updated": lu
                                    });
                                });
                        });
                }
                else {
                    res.json({
                        error: "No info on the provided country"
                    });
                }
            });
    }
    else {
        res.json({
            error: "please provide a country"
        });
    }
});

server.get('/*', (req, res) => {
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
                route: "/:country",
                desc: "Coronavirus stats in the specified country"
            },
            {
                route: "/map",
                desc: "Coronavirus stats in all the available countries mapped in one array"
            }
        ]
    });
});

server.listen(PORT, () => console.log(`listening on ${PORT}...`));