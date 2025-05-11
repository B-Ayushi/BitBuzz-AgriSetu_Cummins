import streamlit as st
import pandas as pd

# Load or simulate the weather dataset
@st.cache_data
def load_data():
    df = pd.read_csv("weather_data.csv")  # replace with your actual file
    df['date_time'] = pd.to_datetime(df['date_time'])
    df['month'] = df['date_time'].dt.month
    df['day'] = df['date_time'].dt.date
    return df

df = load_data()

# Title
st.title("🌾 AgriSetu - Weather Anomaly Detector for Farmers")

# City and month selection
city = st.selectbox("Select your city:", sorted(df['city'].unique()))
month = st.selectbox("Select month (1-12):", sorted(df['month'].unique()))

# Filter by user input
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

# Display anomalies by day (not timestamp)
if anomaly_data.empty:
    st.success(f"No major anomalies detected in {city} during month {month}.")
else:
    st.subheader("🚨 Detected Anomalies (Daily Summary):")
    st.dataframe(anomaly_data[['day', 'maxtempC', 'mintempC', 'humidity', 'uvIndex', 'precipMM', 'Anomalies']])

# Summary
st.markdown("---")
st.markdown("### 🌱 How it affects crops:")
st.markdown("""
- **Extreme Heat (>45°C)**: Can cause heat stress, wilting, and reduced yield.
- **Extreme Cold (<5°C)**: May damage tender crops; risk of frostbite.
- **High Humidity (>90%)**: Increases chances of mildew, blight, and fungal infections.
- **High UV (>10)**: Scorching of sensitive leaves, especially in fruit-bearing plants.
- **Heavy Rainfall (>15mm)**: Waterlogging, root rot, and erosion risks.
""")

# Optional: download option
st.download_button("Download anomaly report", anomaly_data.to_csv(index=False), file_name=f"{city}_month{month}_anomalies.csv")

