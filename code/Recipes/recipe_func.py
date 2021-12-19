# -*- coding: utf-8 -*-
"""
Created on Fri Dec 17 15:55:31 2021

@author: c20460
"""

import requests
import lxml.html as LH
import pandas as pd
from pandas.io.json import json_normalize

def sunbasket(url = 'https://sunbasket.com/menu/'):
    # url = 'https://sunbasket.com/menu/' + '2021-12-26'

    # r = requests.get(url)
    
    html_content = requests.get(url).text
                
    tables = LH.fromstring(html_content)
    
    df = pd.DataFrame(columns=['ID', 'Title', 'Link', 'Site'])
    df['ID'] = tables.xpath('//*[@class="recipe-name"]/a/@data-id')
    df['Link'] = ['https://sunbasket.com' + i for i in tables.xpath('//*[@class="recipe-name"]/a/@href')]
    df['Title'] = [i.text.strip() for i in tables.xpath('//*[@class="recipe-name"]/a')]
    df['Site'] = 'Sunbasket'

    return df

# =============================================================================
############# Still being created
#
# def hellofresh(url = 'https://www.hellofresh.com/recipes/most-popular-recipes?page=1'):
#     # url = 'https://sunbasket.com/menu/' + '2021-12-26'
# 
#     r = requests.get(url)
#     
#     html_content = r.text
#                 
#     tables = LH.fromstring(html_content)
#     
#     df = pd.DataFrame(columns=['ID', 'Title', 'Link', 'Site'])
#     # df['ID'] = tables.xpath('//*[@class="dsbk dsek dsbgr"]/a/@href')
#     df['Link'] = ['https://www.hellofresh.com/' + i for i in tables.xpath('//*[@data-component="searchResultSection"]/a/@href')]
#     df['Title'] = [i.text.strip() for i in tables.xpath('//*[@class="dsd"]')]
#     df['Site'] = 'Hello Fresh'
# 
#     return df
# =============================================================================

def blueapron(url = 'https://www.blueapron.com/cookbook/all/all/This%20Week'):
    # r = requests.get(url)
    
    html_content = requests.get(url).text
                
    tables = LH.fromstring(html_content)
    
    df = pd.DataFrame(columns=['ID', 'Title', 'Link', 'Site'])
    # df['ID'] = tables.xpath('//*[@class="recipe-name"]/a/@data-id')
    df['Link'] = ['https://www.blueapron.com' + i for i in tables.xpath('//*[@class="recipe-thumb col-md-4"]/a/@href')]
    df['Title'] = [i.text.strip() + ' ' + j.text.strip() for i,j in zip(tables.xpath('//*[@class="recipe-thumb col-md-4"]/a/h3'),tables.xpath('//*[@class="recipe-thumb col-md-4"]/a/h4'))]
    df['Site'] = 'Blue Apron'

    return df

def homechef(url = 'https://www.homechef.com/our-menu'):
    # url = 'https://www.homechef.com/our-menus/03-jan-2022'

    # r = requests.get(url)
    
    html_content = requests.get(url).text
    html_content = html_content.replace('\\', '')
                
    tables = LH.fromstring(html_content)
    
    df = pd.DataFrame(columns=['ID', 'Title', 'Link', 'Site'])
    # df['ID'] = tables.xpath('//*[@class="recipe-name"]/a/@data-id')
    df['Link'] = ['https://www.homechef.com' + i for i in tables.xpath('//*[@id="meal"]/article/div/a/@href')]
    df['Title'] = [i.text.strip() + ' ' + j.text.strip() for i,j in zip(tables.xpath('//*[@id="meal"]/article[1]/div/a/div[2]/h1'),tables.xpath('//*[@id="meal"]/article[1]/div/a/div[2]/p[2]'))]
    df['Site'] = 'Home Chef'

    return df

class BearerAuth(requests.auth.AuthBase):
    def __init__(self, token):
        self.token = token
    def __call__(self, r):
        r.headers["authorization"] = "Bearer " + self.token
        return r

def everyplate(url = 'https://www.everyplate.com/weekly-menu'):
    url = 'https://www.everyplate.com/gw/menus-service/menus?week=2021-W51&exclude=recipes.nutrition,recipes.cuisines&product=dinner-box-t3&country=ER&locale=en-US'

    r = requests.get(url, auth=BearerAuth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDI0MDQwMjMsImlhdCI6MTYzOTc3NDI4MCwiaXNzIjoic2VuZiIsImp0aSI6ImI2OGIzMTBmLTQzMjYtNDM1OC04YTFmLTZlOWQzMDBkYmViMyJ9.nIb7imm7IL7e-1mWURlBJHLbWZ2nNPuwv-d9hj_RJZw'))
    
    full_df = json_normalize(r.json()['items'][0]['courses'])
    
    df = pd.DataFrame(columns=['ID', 'Title', 'Link', 'Site'])
    df['ID'] = full_df['recipe.id']
    df['Link'] = full_df['recipe.websiteUrl']
    df['Title'] = full_df['recipe.name'] + ' ' + full_df['recipe.headline']
    df['Site'] = 'EveryPlate'

    return df

