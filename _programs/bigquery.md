---
title: "BigQuery"
categories: 
  - installation
  - signup
language:
  - en
program:
  - bigquery
---

BIgQuery is one of the leading data analytics platforms in the world. It is own and managed by Google, included in the Google Cloud Platform (GCP), which also contains many other tools that can be used for a variety of data process (we may see some other GCP tools being used in future posts).

In its core, BigQuery is a serverless data warehouse, meaning it does require its users to manage a server to keep it running (serverless) and that it can handle data connections to many other databases (warehouse). We will use to host data for some of our projects as it handles more complex data structures than other SQL-like data platforms like MySQL (more on MySQL on later posts), while also being ready to use with basically no installation necessary.

## Installation

Wait...  Didn't I just say basically no installation necessary? That is correct, but we will make sure the whole sign up process and some steps to easily interact with BigQuery as explained below.

First step is to sign up. BigQuery has a free tier that allows users to use, store and interact with data if kept under certain conditions. Currently, free-tier conditions are to stay under 10GB of storage and 1TB of queries per month. This tier is actually pretty generous for small simple projects like the ones we'll work with in our posts. Also, new users get $300 to try other Google projects (keep in mind tools like Cloud Run Functions and Vertex AI as we may touch upon them later on).

Okay, so sign up should be as simple as creating a Google account. Yes, you will need to provide payment information in case you go over the allowed usage, but there are way to keep track of your usage.

Next we will set Google Cloud's Software Development Kit (SDK). While Google has SDKs for many of the biggest coding/scripting languages available (check Google's page for their SDKs [here](https://cloud.google.com/sdk), we will focus on the Command Line Interface (CLI), which will allow us to interact with GCP much more easily. We will go through the highlights of the installation, but Google has extensive documentation on how to use and install the [CLI SDK](https://cloud.google.com/cli)

### Windows


### Ubuntu



## Usages

[public datasets](https://cloud.google.com/bigquery/public-data): from Google Analytics user behavior (like this website is set up to have), medical, census all the way to shakespeare related data.

## Don't pay up

There are a couple of ways to keep track of your usage (so you do not have to pay - at least if you do not want to).

The first one is the out-of-the-box view Google provides you by visiting the [Billing](https://console.cloud.google.com/billing) page.

[add billing screenshot]

The second one (funnily enough) will "cost" you some of your available querying power, but the cost is minimal (about 10MB per query) and it provides more details on the storage, showing you the storage used by table, allowing to make those difficult decisions to drop some tables.

[add query]
