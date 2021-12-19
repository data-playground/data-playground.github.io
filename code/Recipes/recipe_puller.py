# -*- coding: utf-8 -*-
"""
Created on Fri Dec 17 21:02:37 2021

@author: c20460
"""

import recipe_func as Recipes
import pandas as pd
import numpy as np

recipes_df = pd.DataFrame()

recipes_df = recipes_df.append(Recipes.sunbasket())
recipes_df = recipes_df.append(Recipes.blueapron())
recipes_df = recipes_df.append(Recipes.homechef())
recipes_df = recipes_df.append(Recipes.everyplate())

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

sunbasket = '''
### Sunbasket
'''

sunbasket_df = recipes_df[recipes_df['Site'] == 'Sunbasket']
sunbasket_df = sunbasket_df.reset_index()

for i in range(0,len(sunbasket_df)):
    name = sunbasket_df.loc[i,'Title']
    url = sunbasket_df.loc[i,'Link']
    sunbasket = sunbasket + '''
* [{0}]({1})'''.format(name, url)

blueapron = '''

### Blue Apron
'''

blueapron_df = recipes_df[recipes_df['Site'] == 'Blue Apron']
blueapron_df = blueapron_df.reset_index()

for i in range(0,len(blueapron_df)):
    name = blueapron_df.loc[i,'Title']
    url = blueapron_df.loc[i,'Link']
    blueapron = blueapron + '''
* [{0}]({1})'''.format(name, url)

homechef = '''

### Home Chef
'''

homechef_df = recipes_df[recipes_df['Site'] == 'Home Chef']
homechef_df = homechef_df.reset_index()

for i in range(0,len(homechef_df)):
    name = homechef_df.loc[i,'Title']
    url = homechef_df.loc[i,'Link']
    homechef = homechef + '''
* [{0}]({1})'''.format(name, url)

everyplate = '''

### EveryPlate
'''

everyplate_df = recipes_df[recipes_df['Site'] == 'Blue Apron']
everyplate_df = everyplate_df.reset_index()

for i in range(0,len(everyplate_df)):
    name = everyplate_df.loc[i,'Title']
    url = everyplate_df.loc[i,'Link']
    everyplate = everyplate + '''
* [{0}]({1})'''.format(name, url)
    
full_string = head + sunbasket + blueapron + homechef + everyplate

with open('../../../_posts/1900-01-01-Recipes.md', 'w') as f:
    f.write(full_string)