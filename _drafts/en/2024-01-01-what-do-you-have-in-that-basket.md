---
title: "What do you have in that basket?"
subtitle: "Steps to get data for NBA analysis"
categories: 
  - nba
  - pipeline
  - sports
programs:
  - python
languages:
  - en
---

Basketball is one of my favorites sports and NBA is the epitome of high-level basketball. Every player wants to play in the NBA and every fan wants to watch it. As a basketball fan an data fan (#sportsNerd), I want to analyze NBA data.

First step to any analysis is gathering the data. There are a lot of places you can get NBA data ready to be consumed for pretty much every aspect of the game (and some off court data as well). Check the [References](##references) for some examples. 

But what fun is in just getting data fed to you in a platter, giving all the power to choose what you can or cannot analyze on a game of basketball to a third party? That is why we will create our own process to extract NBA from the source (the NBA :smiley:).

Below I will walk through the process to create a process to extract a variety of data points from NBA's endpoints. The final result can be found in [this link](). The final object is a Python class, but we will walk through each function in the sections below.

## Playing tools

To start, we will choose the tools we will use for this process.

The scripting tool of choice is [Python](./programs/Python). We will be able to perform all the necessary steps to extract the data from the NBA's endpoints and transform into neat tables we can use later.

Within Python we will use a couple of packages:
* Part of default Python installation:
  - [datetime](https://docs.python.org/3/library/datetime.html): manipulate date and time objects
  - [itertools](https://docs.python.org/3/library/itertools.html): efficient way to iterate through objects (lists, sets, dictionaries...)
  - [json](https://docs.python.org/3/library/json.html): encode and/or decode JSON (JavaScript Object Notation) objects
  - [time](https://docs.python.org/3/library/time.html): time-related functions (sleep will be used, but it is not necessary)
    
* Need installation (pip links shared below):

  - [pandas](https://pypi.org/project/pandas/): interact with data in a dataframe format
  - [requests](https://pypi.org/project/requests/): extract data from NBA endpoints through GET requests
  - [lxml](https://pypi.org/project/lxml/): read HTML output from requests into pythonic format
  - [google.cloud.bigquery](https://pypi.org/project/google-cloud-bigquery/): interact with Google's BigQuery (optional)
 
After we gather the data, we will need a place where to keep the data to later be analyzed. In this example, we will use Google's [BigQuery](./programs/BigQuery). I have previously created a dataset in BigQuery where we will be loading the NBA data extracted using Python.

## Game List

NBA has a webpage that compiles the games hapenning (or that happened) every day. The [games page](https://www.nba.com/games) defaults to current date, but can be adjusted to display any date since NBA's inception in 1946.

In the function presented below, you can see that we use a {self.GAME_DATE} placeholder that is defined when the class is being initally called. It can take a defined date or the current date if no value is assigned (check the `__init__` method in the full code for more details).

Using the LXML package, we extract the full page content. Then we find a preloaded script within the page source (element with ID equals to `__NEXT_DATA__`). This script contains all the data the page requires to be built (and more) and is loaded within the page at its initial load. This means that even with processes that do not wait for javascript to run within the page (much like requests), the data will still be gathered.

![image](https://github.com/user-attachments/assets/900d34bb-3a88-4722-897a-5b40a3a885c8)

We then can transform the HTML-like text into a JSON structure, as the preloaded script we gathered above is a JSON dictionary, and finally extract the game IDs.

One detail you might have noticed is the use of headers in our request call. The definition of a User-Agent is often required to get a response from webpages, although not strictly necessary. The placement is there as a best practice and will be seen throughout the process for every request we make.

```python
    def func_get_games(self):
        # NBA games URL with date defined in the class
        url = f"https://www.nba.com/games?date={self.GAME_DATE}"

        # headers to be used within the GET request
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0'}

        # Extract text (HTML-like) from the GET request to the URL defined above
        html_content = requests.get(url, headers = headers).text

        # Transform the HTML-like text into a pythonic object
        tables = LH.fromstring(html_content)
        
        # Extract text content from preloaded script element that contains data necessary for page building
        table_json = tables.xpath('//script[@id="__NEXT_DATA__"]')[0].text
        
        # Translate JSON-like text into a JSON structure
        json_object = json.loads(table_json)

        # Get game IDs from the JSON defined above
        games_list = [card['cardData']['gameId'] for card in json_object['props']['pageProps']['gameCardFeed']['modules'][0]['cards']]
        
        return games_list
```

## Game Information



## Game Detailed Data

## References

* https://www.basketball-reference.com/teams/BOS/2024.html (Basketball Reference is recognized as one of the best places to find basketball data, and you can export they tables)
* https://www.kaggle.com/datasets/wyattowalsh/basketball/data (a very comprehensive dataset for games since 1946-47 season, last updated in 2023)
* https://www.bigdataball.com/subscribe/ (paid version of player data in Excel format)
