from typing import Tuple
from bs4 import BeautifulSoup
import cssutils
import requests
import logging
cssutils.log.setLevel(logging.CRITICAL)

class HTMLAnalyser:
    def __init__(self, url:str):
        self.__base_url = url
        response = requests.get(self.__base_url)

        if(response.status_code == 200):
            self.__soup = BeautifulSoup(response.text, features="html.parser")
            self.__css_properties = {}

            for styles in self.__soup.find_all('style'):
                css = cssutils.parseString(styles.encode_contents())
                self.__css_analyse(css)
            
            stylesheet_links = [link['href'] for link in self.__soup.find_all('link') if "stylesheet" in link.get("rel", [])]
            for link in stylesheet_links:
                if(link[0]) == '/':
                    link = self.__base_url + link
                
                raw_css = requests.get(link).text
                css = cssutils.parseString(raw_css)
                self.__css_analyse(css)
        else:
            raise ConnectionError()
            
    
    def __css_analyse(self, css)->None:
        for rule in css:
            if rule.type == rule.STYLE_RULE:
                style = rule.selectorText
                self.__css_properties[style] = {}
                for item in rule.style:
                    propertyname = item.name
                    value = item.value
                    self.__css_properties[style][propertyname] = value
    
    def get_default_colors(self)->Tuple[str, str]:
        bg = "#ffffff"
        fg = "#000000"

        if self.__css_properties.__contains__('*'):
            if self.__css_properties['*'].__contains__('background-color'):
                bg = self.__css_properties['*']['background-color']
            
            if self.__css_properties['body'].__contains__('color'):
                fg = self.__css_properties['body']['color']
        elif self.__css_properties.__contains__('html'):
            if self.__css_properties['html'].__contains__('background-color'):
                bg = self.__css_properties['html']['background-color']
            
            if self.__css_properties['body'].__contains__('color'):
                fg = self.__css_properties['body']['color']
        elif self.__css_properties.__contains__('body'):
            if self.__css_properties['body'].__contains__('background-color'):
                bg = self.__css_properties['body']['background-color']
            
            if self.__css_properties['body'].__contains__('color'):
                fg = self.__css_properties['body']['color']
        
        return (bg, fg)