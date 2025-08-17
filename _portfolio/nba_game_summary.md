---
title: "NBA Game Summary"
main_tool: python
tools: 
  - Python
  - BigQuery
topics:
  - WebScraping
  - ETL
  - API
date: 2025-07-01T00:00:00+00:00
location: https://github.com/data-playground/data-playground-base/blob/main/nba/nba_game_summary.py
description: Exploring NBA data by gathering its box scores and play-by-play tables from its public facing API
thumbnail: "/assets/img/portfolio/nba_game_summary.png"
---

NBA is synonym with basketball. The leading organization for basketball association (by far, with European basketball and its own developmental league trailing by a long distance) offers a rich variety of data points for the data and basketball enthusiasts.

From basic stats (such as points, rebounds, assists) to more complex modelled stats (like PIE - or Player Impact Estimate), it is all available to be gathered, explored and analyzed.

In this process, I set the class NBA to allow for extraction of all box scores currently in existence (traditional, advanced, misc, scoring, usage, four factors, player tracking, hustle, defense, matchups) as well as the play-by-play, that provides excrutiating detail on the events happening on every NBA game.

This is a very fun project that empowered many analysis, models and visual stories for me. Some of them are:

* [NBA Stat Race Dashboard](/portfolio/nba_stat_race_dash)