---
title: "NBA Stat Race Dashboard"
main_tool: tableau
tools: 
  - Tableau
topics:
  - Bar Chart
  - Data Visualization
  - Analytics
date: 2025-07-01T00:00:00+00:00
location: https://public.tableau.com/app/profile/data.playground/viz/NBA2024StatRace/Instructions
description: "Comparing NBA's main stats at the beginning of the 2024-25 season using Tableau out-of-the-box and extended capabilities"
thumbnail: "/assets/img/portfolio/nba-2024-stat-race.png"
include_scripts: [
  "/assets/js/tableau-api.js"
]
---

A great way to visualize NBA data is to check the who are the top players in baskbetball's main stats. That is what I did in this report, reviewing the 2024-25 season's stats.

Using Tableau's out-of-the-box "pages" capabilities, I built a dashboard that provided most of what we needed, showing all the data, but missing an easy way to display the players headshots (for visual recognition).

Tableau Embed API comes to the rescue, allowing us to combine Tableau tools and Javascript, making the data easy to understand and able to recognize the players by their names and faces.

To see the dashboard (powered by the Tableau Embed API) working, interact with the buttons below, pressing the "start" button to begin the loop.

<div id="tableauEmbed">
    <div id="tableauBtn">
        <button id="start-btn" type="button" class="btn btn-outline-dark">
            <span class="material-symbols-outlined">play_arrow</span>
            Start
        </button>
        <button id="pause-btn" type="button" class="btn btn-outline-dark disabled">
            <span class="material-symbols-outlined">pause</span>
            Pause
        </button> 
	    <button id="restart-btn" type="button" class="btn btn-outline-dark disabled">
            <span class="material-symbols-outlined">repeat</span>
            Restart
        </button>
    </div>

    {% include /tableau-embed.html url="https://public.tableau.com/views/NBA2024StatRace/UsingFilter?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" device="tablet" height="850px" name="NBARaceChart__UsingFilter" %}
  
</div>