from flask import Flask, request, jsonify
from flask_cors import CORS  # Add CORS support
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load and preprocess data
def load_data():
    try:
        df = pd.read_csv("merged_hybrid_crops.csv")

        # Data cleaning
        df = df.drop_duplicates(subset=["Crop", "Hybrid"])
        df.fillna("Not Specified", inplace=True)

        # Ensure required columns exist
        required_columns = ["Crop", "Hybrid", "Benefit1", "Benefit2", "Benefit3",
                          "Region", "Duration", "Yield", "DiseaseResistance",
                          "SpecialFeatures", "Vendors"]

        for col in required_columns:
            if col not in df.columns:
                df[col] = "Not Specified"

        # Create searchable text features
        df["Search_Features"] = (
            df["Crop"] + " " + df["Hybrid"] + " " +
            df["Benefit1"] + " " + df["Benefit2"] + " " + df["Benefit3"] + " " +
            df["Region"] + " " + df["SpecialFeatures"]
        )
        return df
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        return pd.DataFrame(columns=required_columns)

# Load data and train model
print("Loading data and training model...")
df = load_data()
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(df["Search_Features"])
print("Model training completed!")

@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_input = data.get('user_input')
    selected_crop = data.get('selected_crop', 'All')
    
    try:
        if selected_crop != "All":
            crop_filtered_df = df[df["Crop"] == selected_crop]
        else:
            crop_filtered_df = df.copy()

        query_vec = vectorizer.transform([user_input])
        similarities = cosine_similarity(
            query_vec,
            vectorizer.transform(crop_filtered_df["Search_Features"])
        ).flatten()

        crop_filtered_df["Match_Score"] = similarities
        recommendations = crop_filtered_df.sort_values("Match_Score", ascending=False).head(5)
        
        return jsonify({
            'success': True,
            'data': recommendations.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        return jsonify({
            'success': True,
            'data': {
                'crops': sorted(df["Crop"].unique().tolist()),
                'regions': sorted(df["Region"].unique().tolist())
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/compare', methods=['POST'])
def compare():
    data = request.json
    selected_crop = data.get('selected_crop', 'All')
    selected_region = data.get('selected_region', 'All')
    hybrids = data.get('hybrids', [])

    try:
        filtered_df = df.copy()
        if selected_crop != "All":
            filtered_df = filtered_df[filtered_df["Crop"] == selected_crop]
        if selected_region != "All":
            filtered_df = filtered_df[filtered_df["Region"].str.contains(selected_region, case=False)]
        
        if hybrids:
            filtered_df = filtered_df[filtered_df["Hybrid"].isin(hybrids)]
        
        return jsonify({
            'success': True,
            'data': filtered_df.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(port=7000)  # Changed to port 6000