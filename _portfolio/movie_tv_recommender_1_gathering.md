---
title: "Movie and TV Recommender - Part 1: the Gathering"
main_tool: python
tools: 
  - Python
  - BigQuery
topics:
  - ETL
  - API
  - Webscraping
date: 2025-07-01T00:00:00+00:00
location: https://github.com/data-playground/data-playground-base/blob/main/movie_recommender/movie_recommender_etl.py
description: "Extracting metadata for movies and TV shows since 2000 to power a content recommender"
thumbnail: "/assets/img/portfolio/movie_tv_recommender_gathering.png"
---

Who has not spent a good part of their night or weekend scrolling through all their streaming services to decide of what to watch next? While every service has their own recommender, a struggle is to find cross-service recommendations, getting that whodunnit marathon right.

The first step for any data project is... data! So here comes ["The Movie DataBase" (TMDb) project](https://www.themoviedb.org/) to the rescue. One of the best (if not the best) open-source project to gather movie and TV shows data. And the best part is that it has an extensive API, with basically all its capabilties available. If you like APIs, you should definitely check it [here](https://developer.themoviedb.org/reference/intro/getting-started).

In this script, I run through the API's endpoints I forsaw using for a content recommender (most on this [here](/portfolio/movie_tv_recommender_2_models) and [here](/portfolio/movie_tv_recommender_3_app)) and save it to BigQuery.
