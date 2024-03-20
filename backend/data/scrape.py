import requests
from bs4 import BeautifulSoup
import json

# Assume `url` is the URL of the page to scrape
url = 'https://helldivers.fandom.com/wiki/Stratagem_Codes_(Helldivers_2)'

# Fetch the web page content
response = requests.get(url)
response.raise_for_status()  # raises an exception for 4XX or 5XX status codes

# Parse the HTML content
soup = BeautifulSoup(response.content, 'html.parser')
# Initialize an empty dictionary for the results
result_dict = {}

# Find all tables on the page
tables = soup.find_all('table', class_='wikitable sortable')
for table in tables:
    # For each row in the table body
    for row in table.find('tbody').find_all('tr'):
        if row.find_all('td'):
            # Extract data
            name_cell = row.find_all('td')[1]
            name = name_cell.text.strip()
            combination_images = row.find_all('td')[2].find_all('img')
            combination = [img['alt'] for img in combination_images]
            try:
                image_url = row.find_all('td')[0].find('img')['src']
            except TypeError:
                image_url = ""
            # Map arrow names to directions (you might need to adjust this mapping)
            direction_mapping = {
                'Arrow 1 D': 'down',
                'Arrow 2 L': 'left',
                'Arrow 3 R': 'right',
                'Arrow 4 U': 'up'
            }
            combination = [direction_mapping.get(img.split('.')[0], img) for img in combination]

            # Update result dictionary
            result_dict[name] = {
                'combination': combination,
                'image': image_url
            }

print(result_dict)
# Convert the dictionary to JSON
result_json = json.dumps(result_dict, indent=2)

print(result_json)
