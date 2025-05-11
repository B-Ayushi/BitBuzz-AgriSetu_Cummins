from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load data
csv_path = os.path.join(os.path.dirname(__file__), 'crop_prices.csv')

df = pd.read_csv(csv_path)
df.columns = df.columns.str.strip()
df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

@app.route('/api/price/predict', methods=['POST'])
def predict_price():
    req_data = request.get_json()
    print("Incoming prediction request:", req_data)
    crop = req_data.get('crop')
    state = req_data.get('state', 'Punjab')

    if not crop:
        return jsonify({"error": "Missing 'crop' in request"}), 400

    crop_data = df[(df['Crop'] == crop) & (df['State'] == state)]

    if crop_data.empty:
        return jsonify({"error": f"No data for crop '{crop}' in state '{state}'"}), 404

    years = ['2019-20', '2020-21', '2021-22', '2022-23']
    try:
        prices = crop_data.iloc[0][years].values.astype(float)
    except Exception as e:
        return jsonify({"error": "Error reading prices", "details": str(e)}), 500

    x = np.arange(len(years))
    y = prices
    coeffs = np.polyfit(x, y, 1)
    predicted = round(coeffs[0] * len(years) + coeffs[1], 2)
    trend = "increasing" if coeffs[0] > 0 else "decreasing"

    print("Prediction response:", {
        "crop": crop,
        "state": state,
        "predicted_price": predicted,
        "trend": trend,
    })

    
    
    return jsonify({
        "crop": crop,
        "state": state,
        "predicted_price": predicted,
        "trend": trend,
        "historical_prices": dict(zip(years, prices.tolist())),
        "currency": "INR/quintal"
    })

@app.route('/api/price/states', methods=['GET'])
def get_states():
   return jsonify([
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
        "West Bengal"
    ])

@app.route('/api/price/crops', methods=['GET'])
def get_crops():
  return jsonify([
        "Wheat", "Rice", "Maize", "Barley", "Jowar", "Bajra", "Millets", 
        "Sugarcane", "Cotton", "Pulses", "Lentil", "Chickpea", "Soybean", 
        "Groundnut", "Mustard", "Sunflower", "Tea", "Coffee", "Tobacco"
    ])

# 🔥 Main entry point
if __name__ == '__main__':
    app.run(debug=True, port=5003)
