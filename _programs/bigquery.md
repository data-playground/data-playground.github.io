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

First step is to sign up. BigQuery has a free tier that allows users to use, store and interact with data if kept under certain conditions. Currently, free-tier conditions are to stay under 10GB of storage and 1TB of queries per month (even though Google is pretty open about it, free tier conditions may change, so make sure to check those numbers before you agree to anything). This tier is actually pretty generous for small simple projects like the ones we'll work with in our posts. Also, new users get $300 to try other Google projects (keep in mind tools like Cloud Run Functions and Vertex AI as we may touch upon them later on).

Okay, so sign up should be as simple as creating a Google account. Yes, you will need to provide payment information in case you go over the allowed usage, but there are way to keep track of your usage.

Next we need to setup Google Cloud's Software Development Kit (SDK). While Google has SDKs for many of the biggest coding/scripting languages available (check Google's page for their SDKs [here](https://cloud.google.com/sdk)), at this point we are concerned about the Command Line Interface (CLI), which will allow us to interact with GCP much more easily. 

Google has extensive documentation on how to use and install the [CLI SDK](https://cloud.google.com/cli), so follow the steps [here](https://cloud.google.com/sdk/docs/install#installation_instructions), selecting the Operating System being used.


## Usages

As mentioned at the top, Google has been increasing the uses of BigQuery, especially with the introduction of AI (mainly powered by Vertex AI). But even at its basic, BigQuery still has a lot to offer.

Of course we will use the SQL-like environment that is the core of BigQuery. I say SQL-like because BigQuery is actually data warehouse, since it accepts semi-structured data, while still allowing communication with such data through its own flavor of querying language. But, going back to our usage, some of the process in our post we'll load (for pipeline process), transform (for data engineering and analytics processes) and extract (mainly for data analytics and data science) data from BigQuery tables.

BigQuery also has [public datasets](https://cloud.google.com/bigquery/public-data) available out-of-the-box. Those datasets contain data from Google Analytics user behavior (like this website is set up to have), medical, census all the way to shakespeare related data. It is a great way to familiarize yourself with a variety of data point and formats. Also, you can find many examples online on how that data was used through the whole spectrum of data.

"Data Transfers" is also a pretty cool aspect of BigQuery. It has a number of integrations to other tools from social media (for Ad accounts for example) to data lakes (like AWS). It also has 3rd party providers in the [Marketplace](https://console.cloud.google.com/marketplace?hl=en&inv=1&invt=AbnevQ) that have created connections to other tools as well (many of them paid, of course).

Finally, for our initial presentation of BigQuery, we'll talk about "Scheduled Queries". BigQuery has its own scheduler that one can use to run preset queries. It can be a great additionto interact with incoming data without having to maintain a connected server by yourself. Beware that those queries count towards your quotas, so use carefully.

BigQuery has many other uses that we may go through in specific posts, so stay tuned and have fun exploring BigQuery on your own.


## Don't pay up

There are a couple of ways to keep track of your usage (so you do not have to pay - at least if you do not want to).

The first one is the out-of-the-box view Google provides you by visiting the [Billing](https://console.cloud.google.com/billing) page.

[add billing screenshot]

The second one (funnily enough) will "cost" you some of your available querying power, but the cost is minimal (about 10MB per query) and it provides more details on the storage, showing you the storage used by table, allowing to make those difficult decisions to drop some tables.

[add query]

There is a third way as well, by using BigQuery's REST API. This is included in any tier (including the free tier), but requires getting some tokens. It takes a little more knowledge and preparation, but it may be interesting if you really need to save those 10MB.

List: 
https://cloud.google.com/bigquery/docs/reference/rest/v2/tables/list?apix=true&apix_params=%7B%22projectId%22%3A%22gcp-dt-ds-internal%22%2C%22datasetId%22%3A%22pmano%22%7D

Get: 
https://cloud.google.com/bigquery/docs/reference/rest/v2/tables/get?apix_params=%7B%22projectId%22%3A%22gcp-dt-ds-internal%22%2C%22datasetId%22%3A%22pmano%22%2C%22tableId%22%3A%22table_info%22%7D&apix=true
