const PORT = 8000;

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const newspapers = [
    {
        name: "thetimes",
        address: "https://www.thetimes.co.uk/environment/climate-change",
        base: "https://www.thetimes.co.uk/environment"
    },
    {
        name: "guardian",
        address: "https://www.theguardian.com/environment/climate-crisis",
        base: "https://www.theguardian.com/environment"
    },
    {
        name: "telegraph",
        address: "https://www.telegraph.co.uk/climate-change",
        base: "https://www.telegraph.co.uk"
    }
];

const articles = [];

newspapers.forEach(newspaper => {

    axios.get(newspaper.address)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            });
        });
    })
    .catch((error) => console.log(error));

});

app.get('/', (req, res) => {

    res.json('Welcome to my climate change news api');

});

app.get('/news', (req, res) => {

    res.json(articles);

});

app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId;

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;
    const newspapeBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
    axios.get(newspaperAddress)
    .then(respoonse => {
        const html = respoonse.data;
        const $ = cheerio.load(html);
        const specificArticles = []

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspapeBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles);
    })
    .catch((errors) => console.log(errors));
});

app.listen(PORT, () => console.log(`server running on port: `, PORT));