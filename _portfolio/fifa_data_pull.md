---
title: "FIFA Data Pull"
main_tool: python
tools: 
  - Python
  - BigQuery
topics:
  - WebScraping
  - ETL
  - API
date: 2025-07-01T00:00:00+00:00
location: https://github.com/data-playground/data-playground-base/blob/main/fifa/fifa_data_pull.py
description: Extracting data from the FIFA's own API for the football data nerd happinness
thumbnail: "/assets/img/portfolio/fifa_data_pull.png"

---

FIFA (or Fédération Internationale de Football Association, in its French origin) is the international governing body of football (not the american type). 

To the luck of the data hungry and football lovers, FIFA also has data on a large variety of competition, spanning from national leagues (such as worldly know Premier League and La Liga) to cups played by the national teams (like the World Cup). To make matters even easier, FIFA has a public API that provides access to anyone that wishes to review, analyze and play around with that data.

In this process, I go through how to tap into FIFA's API to get data for games of any competition available (using the World Cup as example), and subsequently load this data to our preferred database in Google BigQuery.

## Quick Review of the process

For this example, I decided to pull data for the World Cup, a competition firstly hosted in 1930 in Uruguay and with its lasted edition (at the point of this example) in 2022 in Catar. Thse dates are what drove the start and end dates defined in the code.

In the main function of the FIFA class in the script, the process gathers high-level information for all the games in the database, given the competition and dates initially defined. Since the API has a max return of 500 items, the process is prepared to absorb the continuation hash and token, which allow it to return the next set of items. Once every game was gathered, the process extracts detailed information for each game, extracting data like: teams, players available (and how much they played), goalscorers, stadium, geo-location, and even detailed event count, like subtitutions, yellow and red cards and more.

Finally, the process loads these data points in BigQuery to be later utilized in other processes. Below there are a list of existing processes that utilize this data

* [FIFA World Cup history through goals](/portfolio/fifa_world_cup_goals)

