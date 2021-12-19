# -*- coding: utf-8 -*-
"""
Created on Fri Dec 17 21:02:37 2021

@author: c20460
"""
import git 

##### Connect to GIthub Repository
# Instantiate repo object
repo = git.Repo(r"C:\Users\Llubr\Documents\GitHub\data-playground.github.io")
# pull down 
repo.remotes.origin.pull()


##### Get data and update files
import recipe_func as Recipes
import pandas as pd
import datetime

today = datetime.date.today()
weeks = today.strftime("%Y") + '-W' + today.strftime("%V")

recipes_df = pd.DataFrame()

print('Pulling recipes')
recipes_df = recipes_df.append(Recipes.sunbasket())
recipes_df = recipes_df.append(Recipes.blueapron())
recipes_df = recipes_df.append(Recipes.homechef())
recipes_df = recipes_df.append(Recipes.everyplate(weeks = weeks))
recipes_df = recipes_df.append(Recipes.greenchef(weeks = weeks))
recipes_df = recipes_df.append(Recipes.hellofresh(weeks = weeks))

# recipes_df.to_excel(r'C:\Users\c20460\Downloads\Recipes\Recipes.xlsx', index = False)

recipes_df_full = pd.read_excel('Recipes.xlsx')
recipes_df_full = recipes_df_full.append(recipes_df)
recipes_df_full = recipes_df_full.drop_duplicates(subset=['Title', 'Link'])

recipes_df_full.to_excel('Recipes.xlsx', index = False)

#### Pull data from dataframe

recipes_df = recipes_df_full

head = '''---
title: "Recipes"
date: 1900-01-01T00:00:00+00:00
categories: 
  - en
---


'''

recipes_str = ''

sites = recipes_df['Site'].drop_duplicates()

for site in sites:

    print('Writing recipes for' + site)
    site_str = '''
    ### {0}
    '''.format(site)
    
    site_df = recipes_df[recipes_df['Site'] == site]
    site_df = site_df.reset_index()

    for i in range(0,len(site_df)):
        name = site_df.loc[i,'Title']
        url = site_df.loc[i,'Link']
        site_str = site_str + '''
* [{0}]({1})'''.format(name, url)

    site_str = site_str + '''
    
    '''
    
    recipes_str = recipes_str + site_str
    
full_string = head + recipes_str


with open('../../_posts/1900-01-01-Recipes.md', 'w', encoding="utf-8") as f:
    f.write(full_string)
    
##### Commit updates to Github 
COMMIT_MESSAGE = input("Commit Message: ")
repo.git.add(update=True)
repo.index.commit(COMMIT_MESSAGE)
repo.remote(name='origin').push()
