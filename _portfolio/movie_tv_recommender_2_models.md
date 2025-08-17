---
title: "Movie and TV Recommender - Part 2: the Models"
main_tool: python
tools: 
  - Python
topics:
  - Text Analytics
  - Machine Learning
  - Artificial Intelligence
date: 2025-07-01T00:00:00+00:00
location: https://github.com/data-playground/data-playground-base/blob/main/movie_recommender/movie_recommender_models.py
description: "Building models to recommend movies and TV shows based on previously watched content and its metadata (name, keywords and genres)"
thumbnail: "/assets/img/portfolio/movie_tv_recommender_models.png"
---

Who has not spent a good part of their night or weekend scrolling through all their streaming services to decide of what to watch next? While every service has their own recommender, a struggle is to find cross-service recommendations, getting that whodunnit marathon right.

After gathering the data using TMDb's API (see it [here](/portfolio/movie_tv_recommender_1_gathering)), I worked on a variety of models to connect the content pieces (movies and TV shows) in order to recommend what to watch based on what has been previously consumed.

Going from simple content similarity models, passing through bi-gram and tri-gram language models, finishing (for now) with a simple pre-trained BERT model, that not only considers words by themselves, but also their meaning and synonyms.

This script provides a variety of ways (expect new models to continue to appear) to analyze and compare the movies and TV shows to be recommended. An interactive app is built using at least one of these models and it is described [here](/portfolio/movie_tv_recommender_3_app)