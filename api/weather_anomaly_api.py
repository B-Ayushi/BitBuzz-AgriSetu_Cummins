from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load weather data
def load_data():
    df = pd.read_csv("weather_data.csv")  # replace with your actual file
    df['date_time'] = pd.to_datetime(df['date_time'])
    df['month'] = df['date_time'].dt.month
    df['day'] = df['date_time'].dt.date
    return df

df = load_data()

@app.route('/api/weather/cities', methods=['GET'])
def get_cities():
    cities = sorted(df['city'].unique().tolist())
    return jsonify(cities)

@app.route('/api/weather/months', methods=['GET'])
def get_months():
    months = sorted(df['month'].unique().tolist())
    return jsonify(months)

@app.route('/api/weather/anomalies', methods=['POST'])
def detect_anomalies():
    data = request.json
    city = data.get('city')
    month = data.get('month')
    
    if not city or not month:
        return jsonify({"error": "City and month are required"}), 400
    
    try:
        month = int(month)
    except ValueError:
        return jsonify({"error": "Month must be a number (1-12)"}), 400
    
    # Filter data
    filtered = df[(df['city'] == city) & (df['month'] == month)]
    
    # Define anomaly conditions
    def detect_anomalies(row):
        anomalies = []
        if row['maxtempC'] > 45:
            anomalies.append("🔥 Extreme Heat (crop wilting risk)")
        if row['mintempC'] < 5:
            anomalies.append("❄️ Extreme Cold (frost risk)")
        if row['humidity'] > 90:
            anomalies.append("💧 High Humidity (fungal disease risk)")
        if row['uvIndex'] > 10:
            anomalies.append("☀️ High UV (sunburn on crops)")
        if row['precipMM'] > 15:
            anomalies.append("🌧️ Heavy Rainfall (flood risk)")
        return ", ".join(anomalies)
    
    filtered['Anomalies'] = filtered.apply(detect_anomalies, axis=1)
    anomaly_data = filtered[filtered['Anomalies'] != ""]
    
    if anomaly_data.empty:
        return jsonify({
            "message": f"No major anomalies detected in {city} during month {month}.",
            "anomalies": []
        })
    
    # Convert to list of dictionaries
    anomalies = anomaly_data[['day', 'maxtempC', 'mintempC', 'humidity', 'uvIndex', 'precipMM', 'Anomalies']]
    anomalies['day'] = anomalies['day'].astype(str)  # Convert dates to strings
    
    return jsonify({
        "message": f"Detected anomalies in {city} during month {month}",
        "anomalies": anomalies.to_dict(orient='records')
    })

@app.route('/')
def home():
    return "Weather Anomaly Detection API is running!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)