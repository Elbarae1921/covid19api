const rp = require("request-promise");
const $ = require("cheerio");
const iso3 = new Map(require('./iso3.json'));



const url = "https://www.worldometers.info/coronavirus/";
const selector = "#main_table_countries_today tbody";

const getCountriesArray = () => {
    return new Promise(resolve => {
        console.log("scraping the page...");
        rp(url)
            .then(html => {
                const data = $(selector, html);
                const countriesData = data.get(0).children
                    .filter(x => x.hasOwnProperty('children'))
                    .filter(x => Boolean(x.children.length))
                    .slice(8)
                    .map(x => {
                        // if (!x.children[1].children[0].hasOwnProperty("children")) {
                        //     return x.children[1].children[0].data.trim();
                        // }
                        // else {
                        //     return x.children[1].children[0].children[0].data.trim();
                        // }
                        return x.children[3].children[0].children[0].data;
                    });
                console.log("scraping done!");
                resolve(countriesData.filter(r => r !== '' && r !== ' ').map(r => r.trim()));
            })
            .catch(err => {
                console.log(err);
            });
    });
    
}

const getDataArray = async () => {
    return new Promise(resolve => {
        const dataArray = [];
        rp(url)
            .then(html => {
                const data = $("#maincounter-wrap span", html);
                dataArray.push(data.get(0).children[0].data.trim());
                dataArray.push(data.get(1).children[0].data.trim());
                dataArray.push(data.get(2).children[0].data.trim());
                resolve(dataArray);
            })
            .catch(err => {
                console.log(err);
            });
    })
    
}

const getCountryDataArray = async country => {
    return new Promise(resolve => {
        rp(url)
            .then(html => {
                const dataArray = [];
                const data = $(selector, html);
                const vals = data.get(0).children
                    .filter(x => x.hasOwnProperty('children'))
                    .filter(x => Boolean(x.children.length))
                    .slice(8)
                    .filter(x => {
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
                // console.log(vals[0].children[3].children);
                //console.log(vals[0].children[11].children[0].data);
                //console.log(`Total Cases : ${vals[0].children[3].children[0].data}\nNew Cases : ${vals[0].children[7].children[0].data}\nTotal Deaths : ${vals[0].children[9].children[0].data}\nNew Deaths : ${vals[0].children[11].children[0].data}\nTotal Recovered ${vals[0].children[13].children[0].data}\nActive Cases : ${vals[0].children[17].children[0].data}\nSerious/Critical Cases : ${vals[0].children[19].children[0].data}`);
                // confirmed cases
                dataArray.push(vals[0].children[5].hasOwnProperty("children") ? vals[0].children[5].children.length > 0 ?  vals[0].children[5].children[0].data : "" : "");
                // new cases
                dataArray.push(vals[0].children[7].hasOwnProperty("children") ? vals[0].children[7].children.length > 0 ?  vals[0].children[7].children[0].data : "" : "");
                // deaths
                dataArray.push(vals[0].children[9].hasOwnProperty("children") ? vals[0].children[9].children.length > 0 ?  vals[0].children[9].children[0].data : "" : "");
                // new deaths
                dataArray.push(vals[0].children[11].hasOwnProperty("children") ? vals[0].children[11].children.length > 0 ?  vals[0].children[11].children[0].data : "" : "");
                // recoveries
                dataArray.push(vals[0].children[13].hasOwnProperty("children") ? vals[0].children[13].children.length > 0 ?  vals[0].children[13].children[0].data : "" : "");
                // active cases
                dataArray.push(vals[0].children[15].hasOwnProperty("children") ? vals[0].children[15].children.length > 0 ?  vals[0].children[15].children[0].data : "" : "");
                // serious cases
                dataArray.push(vals[0].children[17].hasOwnProperty("children") ? vals[0].children[17].children.length > 0 ?  vals[0].children[17].children[0].data : "" : "");
                // total cases / 1m population
                dataArray.push(vals[0].children[19].hasOwnProperty("children") ? vals[0].children[19].children.length > 0 ?  vals[0].children[19].children[0].data : "" : "");
                resolve(dataArray);
                // total deaths / 1m population
                dataArray.push(vals[0].children[21].hasOwnProperty("children") ? vals[0].children[21].children.length > 0 ?  vals[0].children[21].children[0].data : "" : "");
                resolve(dataArray);
                // total tests
                dataArray.push(vals[0].children[23].hasOwnProperty("children") ? vals[0].children[23].children.length > 0 ?  vals[0].children[23].children[0].data : "" : "");
                resolve(dataArray);
                // tests / 1m population
                dataArray.push(vals[0].children[25].hasOwnProperty("children") ? vals[0].children[25].children.length > 0 ?  vals[0].children[25].children[0].data : "" : "");
                resolve(dataArray);
            })
            .catch(err => {
                console.log(err);
            });
    });
}

const lastUpdated = async () => {
    return new Promise(resolve => {
        rp(url)
            .then(html => {
                const div = $(".content-inner", html);
                const lu = div.get(0).children[9].children[0].data;
                resolve(lu.split(' ').slice(2).join(' ').trim());
            });
    });
}

const mapCountriesData = async countries => {
    return new Promise(resolve => {
        console.log("scraping the page...");
        rp(url)
            .then(html => {
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
                    /*vals[0].children[3].children
                    vals[0].children[7].children
                    vals[0].children[11].children
                    vals[0].children[13].children
                    vals[0].children[15].children*/
                    i++;
                }
                console.log("scraping done!");
                resolve(dataMap);
            })
            .catch(err => {
                console.log(err);
            });
    });
}

const mapCountriesDataIso = async countries => {
    return new Promise(resolve => {
        console.log("scraping the page...");
        rp(url)
            .then(html => {
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
                    /*vals[0].children[3].children
                    vals[0].children[7].children
                    vals[0].children[11].children
                    vals[0].children[13].children
                    vals[0].children[15].children*/
                    i++;
                }
                console.log("scraping done!");
                resolve(dataMap);
            })
            .catch(err => {
                console.log(err);
            });
    });
}

module.exports = {
    getCountriesArray,
    getDataArray,
    getCountryDataArray,
    lastUpdated,
    mapCountriesData,
    mapCountriesDataIso
}