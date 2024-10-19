import sys
import requests
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pprint import pprint
import random
from bson import ObjectId
import json

#Outfit Recommendation Model
#Version: 1.0
#Version Notes - simple implementation - hardcoded api values and centered on matching data retrieval rather than ML prediction 
#Input - Survey Results
#Output - Returns full outfit JSON object array to server.js

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super(JSONEncoder, self).default(o)

def main():

   
    #REPLACE ALDEN LOGIN WITH GENERAL USER LOGIN - WILL ALSO NEED TO CONFIGURE IP PERMISSIONS FOR RENDER WEBSITE USERS
    uri = 'mongodb+srv://alden:1234@boxedfashioncluster.ljset.mongodb.net/?retryWrites=true&w=majority&appName=BoxedfashionCluster'
    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
    except Exception as e:
        print(e)
    db = client['ProductData']
    products = db['ProductData']
    gender = 'Men'

    input_data = sys.stdin.read()
    form_data = json.loads(input_data)
    colors = form_data['colors']
    # color1 = 'Green'
    # color2 = 'Yellow'
    # color3 = 'Black'
    #colors = [color1, color2, color3]
    colors_picked = {}
    
    shirt_names = ['shirt', 'tank', 'jersey', 'tee']
    outerwear_names = ['windbreaker', 'hoodie', 'sweatshirt', 'jacket']
    bottoms_names = ['tights', 'shorts', 'pants', 'leggings']
    accessory_names = ['socks', 'cap', 'slides', 'clogs', 'shoes', 'backpack', 'cleats', 'hat']
    
    def get_first_valid_image(images_str):
        image_urls = images_str.split('~')
        for url in image_urls:
            try:
                response = requests.head(url, timeout=5)
                if response.status_code == 200:
                    return url
            except requests.RequestException as e:
                print(f"Error checking URL {url}: {e}", file=sys.stderr)
        return None  # Return None if no valid URL is found

    def get_random_product(name_list, colors):
        regex = '|'.join(name_list)
        pipeline = [
            {
                '$match': {
                    '$and': [
                        { 'breadcrumbs': { '$regex': gender + '.*' } },
                        { 'name': { '$regex': regex, '$options': 'i' } },
                        { '$or': [{ 'color': color } for color in colors] }
                    ]
                }
            },
            { '$sample': { 'size': 1 } }
        ]
        cursor = products.aggregate(pipeline)
        results = list(cursor)
        if results:
            product = results[0]
            # Get the first valid image URL
            product['images'] = get_first_valid_image(product['images'])
            return product
        return None

    shirt = get_random_product(shirt_names, colors)
    bottoms = get_random_product(bottoms_names, colors)
    outerwear = get_random_product(outerwear_names, colors)
    accessory = get_random_product(accessory_names, colors)
    
    outfit = [item for item in [shirt, bottoms, outerwear, accessory] if item]
    json_output = JSONEncoder().encode(outfit)
    print(json_output)  # Ensure this prints correctly

    #iter 1 - for each category of clothing, retrieve 1 that matches any of the 3 color preferences given and return as outfit rec
    #for sprint 3/4, this will be bolstered to be a multi level perceptron for textual qualities and CNN for image qualities
    #which will then be matched as closely as possible to full extent of textual descriptors given
if __name__ =='__main__': 
    main()