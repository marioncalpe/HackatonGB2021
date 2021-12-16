from bs4 import BeautifulSoup
import cssutils
import requests
import logging
cssutils.log.setLevel(logging.CRITICAL)

base_url = 'https://www.ivao.aero/'

selectors = {}

r = requests.get(base_url)
soup = BeautifulSoup(r.text, features="html.parser")

stylesheet = [link['href'] for link in soup.find_all('link') if "stylesheet" in link.get("rel", [])]

for styles in soup.select('style'):
    css = cssutils.parseString(styles.encode_contents())
    for rule in css:
        if rule.type == rule.STYLE_RULE:
            style = rule.selectorText
            selectors[style] = {}
            for item in rule.style:
                propertyname = item.name
                value = item.value
                selectors[style][propertyname] = value

for link in stylesheet:
    if(link[0]) == '/':
        link = base_url + link
    
    raw_css = requests.get(link).text
    css = cssutils.parseString(raw_css)
    for rule in css:
        if rule.type == rule.STYLE_RULE:
            style = rule.selectorText
            selectors[style] = {}
            for item in rule.style:
                if item.valid:
                    propertyname = item.name
                    value = item.value
                    selectors[style][propertyname] = value

default_bg = selectors['body']['background-color']
default_fg = selectors['body']['color']

print(f'BG {default_bg}')
print(f'FG {default_fg}')