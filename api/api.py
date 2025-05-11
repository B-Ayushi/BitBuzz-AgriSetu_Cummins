from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model and scaler
def load_ml_components():
    with open("ml_components/minmaxscaler.pkl", "rb") as f:
        scaler = pickle.load(f)
    with open("ml_components/model.pkl", "rb") as f:
        model = pickle.load(f)
    return scaler, model

scaler, model = load_ml_components()

crop_dict = {
    1: 'rice', 2: 'maize', 3: 'chickpea', 4: 'kidneybeans',
    5: 'pigeonpeas', 6: 'mothbeans', 7: 'mungbean', 8: 'blackgram',
    9: 'lentil', 10: 'pomegranate', 11: 'banana', 12: 'mango',
    13: 'grapes', 14: 'watermelon', 15: 'muskmelon', 16: 'apple',
    17: 'orange', 18: 'papaya', 19: 'coconut', 20: 'cotton',
    21: 'jute', 22: 'coffee'
}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Validate input
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Prepare input array
        input_data = np.array([[
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]])

        # Scale and predict
        scaled_input = scaler.transform(input_data)
        prediction = model.predict(scaled_input)
        crop_name = crop_dict.get(int(prediction[0]), "Unknown crop")

        return jsonify({
            'prediction': crop_name,
            'status': 'success'
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/')
def home():
    return "Crop Prediction API is running!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)