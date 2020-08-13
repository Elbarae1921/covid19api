const puppeteer = require("puppeteer");
const svg2img = require("svg2img");
const fs = require("fs");




const updateCasesChart = async () => {
    const browser = await puppeteer.launch();
    const page = await  browser.newPage();
    await page.goto("https://www.worldometers.info/coronavirus/");

    const svg = await page.evaluate(() => {
        return document.getElementById("coronavirus-cases-linear").firstElementChild.innerHTML;
    });

    svg2img(svg, (err, buffer) => {
        if(err) return console.log(err);
        fs.writeFile("total_cases_chart.png", buffer, () => {
            console.info("Cases chart updated.")
        });
    });
}

const updateDeathsChart = async () => {
    const browser = await puppeteer.launch();
    const page = await  browser.newPage();
    await page.goto("https://www.worldometers.info/coronavirus/");

    const svg = await page.evaluate(() => {
        return document.getElementById("coronavirus-deaths-linear").firstElementChild.innerHTML;
    });

    svg2img(svg, (err, buffer) => {
        if(err) return console.log(err);
        fs.writeFile("total_deaths_chart.png", buffer, () => {
            console.info("Deaths chart updated.")
        });
    })
}




module.exports = updateChart = () => {
    updateCasesChart();
    updateDeathsChart();
}