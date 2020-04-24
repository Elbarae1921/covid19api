require('dotenv').config();
const express = require('express');
const Scraper = require('./dataScraper');

const PORT = process.env.PORT || 5000;

const server = express();

server.get('/', (req, res) => {
    Scraper.getDataArray().then(data => {
        res.json({
            "Total Cases": data[0],
            "Total Recoveries": data[2],
            "Total Deaths": data[1]
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
                                "Country": country,
                                "Total Cases": data[0],
                                "New Cases": data[1],
                                "Total Deaths": data[2],
                                "New Deaths": data[3],
                                "Total Recovered": data[4],
                                "Active Cases": data[5]
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