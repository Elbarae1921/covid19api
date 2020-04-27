require('dotenv').config();
const express = require('express');
const Scraper = require('./dataScraper');

const PORT = process.env.PORT || 5000;

const server = express();

server.get('/', (req, res) => {
    Scraper.getDataArray().then(data => {
        res.json({
            "confirmed": data[0],
            "recoveries": data[2],
            "deaths": data[1]
        });
    })
});

server.get('/:country', (req, res) => {
    let country = req.params.country;
    if (country) {
        country = country.replace(/\s/g, "");
        Scraper.getCountriesArray()
            .then(countries => {
                if (countries.find(c => c == country)) {
                    Scraper.getCountryDataArray(country)
                        .then(data => {
                            res.json({
                                "country": country,
                                "confirmed": data[0],
                                "new_cases": data[1],
                                "deaths": data[2],
                                "new_deaths": data[3],
                                "recoveries": data[4],
                                "active_cases": data[5]
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
                route: "/:country",
                desc: "Coronavirus stats in the specified country"
            }
        ]
    });
});

server.listen(PORT, () => console.log(`listening on ${PORT}...`));