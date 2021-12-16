from typing import Tuple
from bs4 import BeautifulSoup
import cssutils
import requests
import logging
cssutils.log.setLevel(logging.CRITICAL)

class Test:
    def __init__(self, url:str):
        self.__base_url = url
        response = requests.get(self.__base_url)

        if(response.status_code == 200):
            self.__soup = BeautifulSoup(response.text, features="html.parser")
            
            for link in self.__soup.find_all('link'):
                if "stylesheet" in link.get("rel", []):
                    if link['href'][0] == '/':
                        link['href'] = self.__base_url + link['href']
            
            self.__raw_html = self.__soup.prettify()
        else:
            raise ConnectionError()
    
    def get_raw_html(self):
        return self.__raw_html