import sys
import requests
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
import random
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from bson import ObjectId

#Outfit Recommendation Model
#Version: 2.0
#Version Notes - supdated to include Logistic Regression for product matching based on colors, fit, and climate.
#Input - Survey Results
#Output - Returns full outfit JSON object array to server.js

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super(JSONEncoder, self).default(o)

def main():
    uri = 'mongodb+srv://alden:1234@boxedfashioncluster.ljset.mongodb.net/?retryWrites=true&w=majority&appName=BoxedfashionCluster'
    
    client = MongoClient(uri, server_api=ServerApi('1'))
    try:
        client.admin.command('ping')
    except Exception as e:
        print(e)

    db = client['ProductData']
    products = db['products']
    
    input_data = sys.stdin.read()
    form_data = json.loads(input_data)
    colors = form_data['colors']
    fit_type = form_data['fit']
    season = form_data['climate']

    gender = 'Men'

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
        return None

    def load_product_data():
        cursor = products.find({ 'breadcrumbs': { '$regex': gender + '.*' } })
        data = list(cursor)
        return pd.DataFrame(data)

    def preprocess_product_data(df):
        df = df[['color', 'fit_type', 'season', 'name', 'images']]
        return df

    def build_logistic_regression_model(df):
        # Prepare the data for training: We need one-hot encoding for categorical data
        X = df[['color', 'fit_type', 'season']]
        y = df['name']  # Predict the product name as a target

        # One-hot encode categorical features
        preprocessor = ColumnTransformer(
            transformers=[
                ('cat', OneHotEncoder(), ['color', 'fit_type', 'season'])
            ])
        
        # Create a pipeline: Preprocessing + Logistic Regression
        model = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', LogisticRegression())
        ])

        # Train the model
        model.fit(X, y)
        return model

    def get_closest_product(form_data, model, df):
        input_features = pd.DataFrame([{
            'color': ', '.join(form_data['colors']), 
            'fit_type': form_data['fit_type'], 
            'season': form_data['season']
        }])

        # Predict the closest product using the trained model
        predicted_product_name = model.predict(input_features)[0]
        
        # Return the product details based on the prediction
        matching_product = df[df['name'] == predicted_product_name].iloc[0]
        matching_product['images'] = get_first_valid_image(matching_product['images'])
        return matching_product

    # Load product data and preprocess
    df = load_product_data()
    df = preprocess_product_data(df)

    # Build the logistic regression model
    model = build_logistic_regression_model(df)

    # Get the closest product based on the form input
    closest_shirt = get_closest_product(form_data, model, df)
    closest_bottoms = get_closest_product(form_data, model, df)
    closest_outerwear = get_closest_product(form_data, model, df)
    closest_accessory = get_closest_product(form_data, model, df)
    
    # Assemble the outfit
    outfit = [closest_shirt, closest_bottoms, closest_outerwear, closest_accessory]
    
    json_output = JSONEncoder().encode(outfit)
    print(json_output)

if __name__ == '__main__':
    main()
