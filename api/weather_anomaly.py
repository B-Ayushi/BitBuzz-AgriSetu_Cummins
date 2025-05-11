from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from datetime import datetime
import uvicorn
from fastapi.responses import HTMLResponse

app = FastAPI(title="AgriSetu Weather Anomaly API")

# Enable CORS for all routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load or simulate the weather dataset
def load_data():
    df = pd.read_csv("weather_data.csv")
    # Explicitly specify date format and handle errors
    df['date_time'] = pd.to_datetime(df['date_time'], format='%d-%m-%Y %H:%M', errors='coerce')
    # Drop rows with invalid dates
    df = df.dropna(subset=['date_time'])
    df['month'] = df['date_time'].dt.month
    df['day'] = df['date_time'].dt.date
    return df

df = load_data()

# Request schema
class WeatherRequest(BaseModel):
    city: str
    month: int
    season: str
    cropType: str

# Root route for status check
@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <html>
        <head>
            <title>Weather Anomaly Detection API</title>
        </head>
        <body style="font-family: sans-serif; background-color: white; color: black;">
            <h2>Weather Anomaly Detection API is running!</h2>
        </body>
    </html>
    """

# Function to simulate the prediction based on past data
def predict_weather(df, city, month):
    filtered = df[(df['city'].str.lower() == city.lower()) & (df['month'] == month)]

    if filtered.empty:
        raise Exception(f"No weather data available for {city} during month {month}.")

    # Example: Calculate the average of the past data
    avg_temp = filtered['maxtempC'].mean()
    avg_precip = filtered['precipMM'].mean()
    avg_humidity = filtered['humidity'].mean()

    # Generate a simulated 7-day forecast (for simplicity, here it's just average data)
    forecast = {
        "temperature": {"current": avg_temp, "predicted": [avg_temp]*7},
        "precipitation": {"current": avg_precip, "predicted": [avg_precip]*7},
    }

    return forecast

# Crop protection advice logic based on weather conditions
def generate_crop_advice(weather_forecast, crop_type):
    advice = []

    # Based on temperature
    if weather_forecast['temperature']['current'] > 35:
        advice.append("🌞 High temperature expected, consider crops that tolerate heat.")
        if crop_type in ['Rice', 'Soybean']:
            advice.append("❗ Rice and Soybean are sensitive to high heat, avoid planting these crops.")
    elif weather_forecast['temperature']['current'] < 10:
        advice.append("❄️ Cold weather predicted, avoid crops sensitive to frost like tomatoes.")
        if crop_type in ['Tomato', 'Maize']:
            advice.append("❗ Consider switching to cold-tolerant crops.")

    # Based on precipitation
    if weather_forecast['precipitation']['current'] > 15:
        advice.append("🌧️ Heavy rainfall expected. Prepare drainage and protect crops from flooding.")
        if crop_type in ['Cotton', 'Soybean']:
            advice.append("❗ Cotton and Soybean are sensitive to excessive rainfall, consider soil draining solutions.")

    return advice

# Anomaly detection and weather forecasting endpoint
@app.post("/detect-anomalies")
async def detect_anomalies(request: WeatherRequest):
    try:
        print(f"Received request for city: {request.city}, month: {request.month}")
        
        filtered = df[(df['city'].str.lower() == request.city.lower()) & 
                     (df['month'] == request.month)]
        
        print(f"Found {len(filtered)} matching records")
        
        if filtered.empty:
            print("No matching data found")
            return {
                "status": "error",
                "message": f"No data found for {request.city.title()} in month {request.month}.",
                "prediction": None
            }

        # Get the most recent data point
        latest = filtered.iloc[-1]
        
        # Generate predictions
        prediction = {
            "weatherForecast": {
                "temperature": {
                    "current": latest['maxtempC'],
                    "predicted": [latest['maxtempC']] * 7,  # Simplified prediction
                    "anomaly": "High temperature warning" if latest['maxtempC'] > 35 else ""
                },
                "precipitation": {
                    "current": latest['precipMM'],
                    "predicted": [latest['precipMM']] * 7,  # Simplified prediction
                    "anomaly": "Heavy rain expected" if latest['precipMM'] > 15 else ""
                }
            },
            "riskAssessment": "Moderate risk based on current conditions",
            "cropRecommendations": generate_crop_advice({
                "temperature": {"current": latest['maxtempC']},
                "precipitation": {"current": latest['precipMM']}
            }, request.cropType)
        }

        return {
    "status": "success",
    "message": f"Weather prediction for {request.city.title()}",
    "prediction": prediction  # Fixed typo here (was "prediction")
}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Run the server
if __name__ == '__main__':
    uvicorn.run("weather_anomaly:app", host="127.0.0.1", port=8004, reload=True)
