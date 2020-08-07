const fs = require('fs/promises');
const rp = require("request-promise");
const $ = require("cheerio");
const iso3 = new Map(require('./iso3.json'));



const url = "https://www.worldometers.info/coronavirus/";
const selector = "#main_table_countries_today tbody";

const getCountriesArray = async () => {
        console.log("scraping the page...");
        try {
            const html = await rp(url);
            const data = $(selector, html);
            const countriesData = data.get(0).children
                .filter(x => x.hasOwnProperty('children'))
                .filter(x => Boolean(x.children.length))
                .slice(8)
                .map(x => {
                    // old logic for fetching countries just in case they change the layout back

                    // if (!x.children[1].children[0].hasOwnProperty("children")) {
                    //     return x.children[1].children[0].data.trim();
                    // }
                    // else {
                    //     return x.children[1].children[0].children[0].data.trim();
                    // }
                    return x.children[3].children[0].children[0].data;
                });
            console.log("scraping done!");
            return countriesData.filter(r => r !== '' && r !== ' ').map(r => r.trim());
        }
        catch {
            console.log(err);
        }
    
}

const getDataArray = async () => {
    try {
        const html = await rp(url)
        const data = $("#maincounter-wrap span", html);
        const dataArray = [data.get(0).children[0].data.trim(), data.get(1).children[0].data.trim()];
        return dataArray;
    }
    catch {
        console.log(err);
    } 
}

const getCountryDataArray = async country => {
    try {
        const html = await rp(url)
        const dataArray = [];
        const data = $(selector, html);
        const vals = data.get(0).children
            .filter(x => x.hasOwnProperty('children'))
            .filter(x => Boolean(x.children.length))
            .slice(8)
            .filter(x => {
                // old logic for fetching cases data just in case they change the layout back
                
                // if (!x.children[1].children[0].hasOwnProperty("children")) {
                //     if(x.children[1].children[0].data.trim() == country)
                //         return true;
                //     else
                //         return false
                // }
                // else {
                //     if(x.children[1].children[0].children[0].data.trim() == country)
                //         return true;
                //     else
                //         return false;
                // }
                if(x.children[3].children[0].children[0].data.trim() == country)
                    return true;
                else
                    return false;
            });
        for(let i = 5; i < 26; i+=2) {
            dataArray.push(vals[0].children[i].hasOwnProperty("children") ? vals[0].children[i].children.length > 0 ?  vals[0].children[i].children[0].data : "" : "");
        }
        return dataArray;
    }
    catch {
        console.log(err);
    }
}

const lastUpdated = async () => {
    const html = await rp(url);
    const div = $(".content-inner", html);
    const lu = div.get(0).children[9].children[0].data;
    return lu.split(' ').slice(2).join(' ').trim();
}

const mapCountriesData = async countries => {
    console.log("scraping the page...");
    try {
        const html = await rp(url);
        const dataMap = new Map();
        const data = $(selector, html);
        var i = 7;
        for(let country of countries)
        {
            let vals = data.get(0).children
                .filter(x => x.hasOwnProperty('children'))
                .filter(x => Boolean(x.children.length))
                .slice(8)
                .filter(x => {
                    // old logic for fetching cases data just in case they change the layout back
                    
                    // if (!x.children[1].children[0].hasOwnProperty("children")) {
                    //     if(x.children[1].children[0].data.trim() == country)
                    //         return true;
                    //     else
                    //         return false
                    // }
                    // else {
                    //     if(x.children[1].children[0].children[0].data.trim() == country)
                    //         return true;
                    //     else
                    //         return false;
                    // }
                    if(x.children[3].children[0].children[0].data.trim() == country)
                        return true;
                    else
                        return false;
                });

            let cases = vals[0].children[5].hasOwnProperty("children") ? vals[0].children[5].children.length > 0 ?  vals[0].children[5].children[0].data : "" : "";

            let deaths = vals[0].children[9].hasOwnProperty("children") ? vals[0].children[9].children.length > 0 ?  vals[0].children[9].children[0].data : "" : "";

            let recoveries = vals[0].children[13].hasOwnProperty("children") ? vals[0].children[13].children.length > 0 ?  vals[0].children[13].children[0].data : "" : "";

            dataMap.set(country, [cases, deaths, recoveries]);
            i++;
        }
        console.log("scraping done!");
        return dataMap;
    }
    catch {
        console.log(err);
    }
}

const mapCountriesDataIso = async countries => {
    console.log("scraping the page...");
    try {
        const html = await rp(url);
        countries.shift();
        const dataMap = new Map();
        const data = $(selector, html);
        var i = 7;
        for(let country of countries)
        {
            if(!iso3.get(country))
                continue;
            let vals = data.get(0).children
                .filter(x => x.hasOwnProperty('children'))
                .filter(x => Boolean(x.children.length))
                .slice(8)
                .filter(x => {
                    // old logic for fetching cases data just in case they change the layout back
                    
                    // if (!x.children[1].children[0].hasOwnProperty("children")) {
                    //     if(x.children[1].children[0].data.trim() == country)
                    //         return true;
                    //     else
                    //         return false
                    // }
                    // else {
                    //     if(x.children[1].children[0].children[0].data.trim() == country)
                    //         return true;
                    //     else
                    //         return false;
                    // }
                    if(x.children[3].children[0].children[0].data.trim() == country)
                        return true;
                    else
                        return false;
                });

            let cases = vals[0].children[5].hasOwnProperty("children") ? vals[0].children[5].children.length > 0 ?  vals[0].children[5].children[0].data : "" : "";

            let deaths = vals[0].children[9].hasOwnProperty("children") ? vals[0].children[9].children.length > 0 ?  vals[0].children[9].children[0].data : "" : "";

            let recoveries = vals[0].children[13].hasOwnProperty("children") ? vals[0].children[13].children.length > 0 ?  vals[0].children[13].children[0].data : "" : "";

            dataMap.set(iso3.get(country), [country, cases, deaths, recoveries]);
            i++;
        }
        console.log("scraping done!");
        return dataMap;
    }
    catch {
        console.log(err);
    }
}

const getDaily = async () => {
    const buffer = await fs.readFile('daily.json');
    const dailyData = JSON.parse(buffer);
    return dailyData;
}

module.exports = {
    getCountriesArray,
    getDataArray,
    getCountryDataArray,
    lastUpdated,
    mapCountriesData,
    mapCountriesDataIso,
    getDaily
}