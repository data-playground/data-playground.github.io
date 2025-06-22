# -*- coding: utf-8 -*-
"""
Created on Fri Dec 17 15:55:31 2021

@author: c20460
"""

import requests
import lxml.html as LH
import pandas as pd
from pandas.io.json import json_normalize

def sunbasket(init_url = 'https://sunbasket.com/menu/', week = ''):
    url = init_url + week

    # r = requests.get(url)
    
    html_content = requests.get(url).text
                
    tables = LH.fromstring(html_content)
    
    df = pd.DataFrame(columns=['ID', 'Title', 'Link', 'Site'])
    df['ID'] = tables.xpath('//*[@class="recipe-name"]/a/@data-id')
    df['Link'] = ['https://sunbasket.com' + i for i in tables.xpath('//*[@class="recipe-name"]/a/@href')]
    df['Title'] = [i.text.strip() for i in tables.xpath('//*[@class="recipe-name"]/a')]
    df['Site'] = 'Sunbasket'
    
    print('Done - Sunbasket')

    return df

def blueapron(url = 'https://www.blueapron.com/cookbook/all/all/This%20Week'):
    # r = requests.get(url)
    
    html_content = requests.get(url).text
                
    tables = LH.fromstring(html_content)
    
    df = pd.DataFrame(columns=['ID', 'Title', 'Link', 'Site'])
    # df['ID'] = tables.xpath('//*[@class="recipe-name"]/a/@data-id')
    df['Link'] = ['https://www.blueapron.com' + i for i in tables.xpath('//*[@class="recipe-thumb col-md-4"]/a/@href')]
    df['Title'] = [i.text.strip() + ' ' + j.text.strip() for i,j in zip(tables.xpath('//*[@class="recipe-thumb col-md-4"]/a/h3'),tables.xpath('//*[@class="recipe-thumb col-md-4"]/a/h4'))]
    df['Site'] = 'Blue Apron'
    
    print('Done - Blue Apron')

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
    
    print('Done - Home Chef')

    return df

class BearerAuth(requests.auth.AuthBase):
    def __init__(self, token):
        self.token = token
    def __call__(self, r):
        r.headers["authorization"] = "Bearer " + self.token
        return r

def everyplate(url = 'https://www.everyplate.com/gw/menus-service/menus', weeks = ''):
    params = {
        'week': weeks,
        # 'exclude': 'recipes.nutrition,recipes.cuisines',
        # 'product': 'dinner-box-t3',
        'country': 'ER',
        # 'locale': 'en-US'
        }
    
    # url = 'https://www.everyplate.com/gw/menus-service/menus'

    r = requests.get(url, params = params, auth=BearerAuth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDI0MDQwMjMsImlhdCI6MTYzOTc3NDI4MCwiaXNzIjoic2VuZiIsImp0aSI6ImI2OGIzMTBmLTQzMjYtNDM1OC04YTFmLTZlOWQzMDBkYmViMyJ9.nIb7imm7IL7e-1mWURlBJHLbWZ2nNPuwv-d9hj_RJZw'))
    
    full_df = json_normalize(r.json()['items'][0]['courses'])
    
    df = pd.DataFrame(columns=['ID', 'Title', 'Link', 'Site'])
    df['ID'] = full_df['recipe.id']
    df['Link'] = full_df['recipe.websiteUrl']
    df['Title'] = full_df['recipe.name'] + ' ' + full_df['recipe.headline']
    df['Site'] = 'EveryPlate'
    
    print('Done - EveryPlate')

    return df

def greenchef(url = 'https://chef.greenchef.com/gw/menus-service/menus', weeks = ''):
    params = {
        'week': weeks,
        # 'exclude': 'recipes.nutrition,recipes.cuisines',
        # 'product': 'dinner-box-t3',
        'country': 'CG',
        # 'locale': 'en-US'
        }
    
    # url = 'https://www.everyplate.com/gw/menus-service/menus'

    r = requests.get(url, params = params, auth=BearerAuth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDI0MDM4ODQsImlhdCI6MTYzOTc3NDE0MSwiaXNzIjoic2VuZiIsImp0aSI6IjVlZjQwNDgwLTI3ZDktNDhmNC1hZTgwLWFlZTBkMzUxMTllNiJ9.npZhSrcc_AebOgIFC7pu2Z4DaWV9p7X2iiXv8vQlQpQ'))
    
    full_df = json_normalize(r.json()['items'][0]['courses'])
    
    df = pd.DataFrame(columns=['ID', 'Title', 'Link', 'Site'])
    df['ID'] = full_df['recipe.id']
    df['Link'] = full_df['recipe.websiteUrl']
    df['Title'] = full_df['recipe.name'] + ' ' + full_df['recipe.headline']
    df['Site'] = 'Green Chef'
    
    print('Done - Green Chef')

    return df

def hellofresh(url = 'https://www.hellofresh.com/gw/menus-service/menus', weeks = ''):
    params = {
        'week': weeks,
        # 'exclude': 'recipes.nutrition,recipes.cuisines',
        # 'product': 'dinner-box-t3',
        'country': 'us',
        # 'locale': 'en-US'
        }
    
    # url = 'https://www.everyplate.com/gw/menus-service/menus'

    r = requests.get(url, params = params, auth=BearerAuth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDI1NzQzNTYsImlhdCI6MTYzOTk0NDYxMywiaXNzIjoic2VuZiIsImp0aSI6IjYwNWZjMWQ5LTBhMmItNDcxZi04NzIwLWU1ZDA3MjlhYzdhMSJ9.NRpLoTPVQX2Nty0CGabSiTBQvS6Q2F0x1c7r38tXpms'))
    
    full_df = json_normalize(r.json()['items'][0]['courses'])
    
    df = pd.DataFrame(columns=['ID', 'Title', 'Link', 'Site'])
    df['ID'] = full_df['recipe.id']
    df['Link'] = full_df['recipe.websiteUrl']
    df['Title'] = full_df['recipe.name'] + ' ' + full_df['recipe.headline']
    df['Site'] = 'Hello Fresh'
    
    print('Done - Hello Fresh')

    return df

# =============================================================================
############# Still being created
#
# def marleyspoon(url = 'https://api.marleyspoon.com/graphql', week = 3):
#     headers = {
#         # 'accept': '*/*',
#         # 'accept-encoding': 'gzip, deflate, br',
#         # 'accept-language': 'en-US,en;q=0.9,pt;q=0.8',
#         # 'content-type': 'application/json',
#         # 'origin': 'https://marleyspoon.com',
#         # 'referer': 'https://marleyspoon.com/',
#         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
#         }
#     
#     r = requests.post(url, headers = headers, auth=BearerAuth('eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtcyIsImNvdW50cnkiOiJ1cyIsImJyYW5kIjoibXMiLCJ0cyI6MTYzOTk0NTEzOCwicmFuZG9tX2lkIjoiNDU3ZTRlIn0.nbshifsbrr1X1g4osgsGi8ZKfiqlyR0up6SC2WFS5j4'))
#     
#     full_df = json_normalize(r.json()['data']['menu'][week])
#     
#     df = pd.DataFrame(columns=['ID', 'Title', 'Link', 'Site'])
#     df['ID'] = full_df['recipe.id']
#     df['Link'] = full_df['recipe.websiteUrl']
#     df['Title'] = full_df['recipe.name'] + ' ' + full_df['recipe.headline']
#     df['Site'] = 'EveryPlate'
# 
#     return df
# =============================================================================
