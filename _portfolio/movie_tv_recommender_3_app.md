---
title: "Movie and TV Recommender - Part 3: the Application"
main_tool: python
tools: 
  - Streamlit
topics:
  - App Development
  - Streamlit
  - Machine Learning
date: 2025-07-01T00:00:00+00:00
location: https://github.com/data-playground/data-playground-base/blob/main/movie_recommender/recommender_app/app.py
description: 'Streamlit application to host a movie and TV show recommender based on a selection of "pre-watched" content pieces'
thumbnail: "/assets/img/portfolio/movie_tv_recommender_app.png"
---

I am sure I am not the only one that has spent hours going between all of the streaming services, trying to find what is available. Then you click on something and find out that you were only recommended that movie or TV show because the service wants to push a certain production or because of that secret hate-watch.

Well, I wanted to break away form that and get the freedom to decide what recommendations are based off of, while getting recommended titles from any and all streaming services I own at once, even taking cross-service recommendation as one of the biggest gains.

Using Streamlit (a web application tool built in Python), I make my recommendation models available for any to enjoy. You can interact with the Streamlit Application [here](https://data-playground-movie-recommender.streamlit.app/) (It might be turned off if not visited in a while, just click the button to turn it on and wait a little bit for the machine to start).

Using TMDb's database of movies and TV shows (find out more (here)[/portfolio/movie_tv_recommender_1_gathering]) and models I built (here)[/portfolio/movie_tv_recommender_3_app], this application might save you some time and expose more titles than you expected.