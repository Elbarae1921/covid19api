# covid19api
[coronavirus worldwide statistics API](https://api19covid.herokuapp.com/)

This api scrapes data from [worldometers](https://www.worldometers.info/coronavirus/) for every request (except /daily, it uses file i/o) which makes the provided data very accurate at the cost of loading time.

The api will crash in the future since the [website](https://www.worldometers.info/coronavirus/) gets design/layout changes almost every week, but i'm gonna keep an eye and update the scraper whenever some big change -that might cause problems- happens :).

The daily data in /daily is updated only once a day at 23:58PM GMT0 which makes it relatively faster than other routes since the API doesn't make any http requests. 

# Installation

```npm install```

# Usage

```node server.js```

access `http://localhost:5000`

example `http://localhost:5000/Morocco`