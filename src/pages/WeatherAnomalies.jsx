import React, { useState } from 'react';

function WeatherAnomalies() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [timeframe, setTimeframe] = useState("7days");
  const [priority, setPriority] = useState("Temperature");
  const [showResults, setShowResults] = useState(false);

  const allStatesOfIndia = [
    "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla",
    "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur",
    "Kakinada", "Krishna", "Kurnool", "Nandyal", "Nellore", "NTR", "Palnadu",
    "Parvathipuram Manyam", "Prakasam", "Srikakulam", "Sri Sathya Sai", "Tirupati",
    "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa", "Anjaw", "Changlang",
    "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada",
    "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai",
    "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang",
    "Upper Subansiri", "West Kameng", "West Siang", "Baksa", "Bajali", "Barpeta", "Biswanath",
    "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh",
    "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan",
    "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon",
    "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tamulpur", "Tinsukia", "Udalguri",
    "West Karbi Anglong", "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur",
    "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar",
    "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda",
    "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar",
    "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran", "Balod", "Baloda Bazar", "Balrampur-Ramanujganj",
    "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi",
    "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Khairagarh-Chhuikhadan-Gandai", "Kondagaon", "Korba",
    "Korea", "Mahasamund", "Manendragarh-Chirmiri-Bharatpur", "Mohla-Manpur-Ambagarh Chowki", "Mungeli", "Narayanpur",
    "Raigarh", "Raipur", "Rajnandgaon", "Sarguja"
  ];

  const crops = [
    "Wheat", "Rice", "Maize", "Soybean", "Cotton", "Potato",
    "Tomato", "Sugarcane", "Millet", "Sorghum"
  ];

  const mockForecast = [
    { date: "2025-05-11", temp: 34, humidity: 60, precip: 5, condition: "Sunny" },
    { date: "2025-05-12", temp: 35, humidity: 62, precip: 2, condition: "Clear" },
    { date: "2025-05-13", temp: 33, humidity: 58, precip: 1, condition: "Sunny" },
    { date: "2025-05-14", temp: 36, humidity: 55, precip: 0, condition: "Sunny" },
    { date: "2025-05-15", temp: 37, humidity: 57, precip: 0, condition: "Clear" },
    { date: "2025-05-16", temp: 38, humidity: 60, precip: 3, condition: "Partly Cloudy" },
    { date: "2025-05-17", temp: 39, humidity: 63, precip: 5, condition: "Sunny" }
  ];

  const mockRecommendations = [
    " Consider heat-resistant crops like millet or sorghum",
    " Increase irrigation frequency to compensate for evaporation",
    " Ensure proper drainage in fields to prevent waterlogging",
    " For " + selectedCrop + ": Monitor closely for weather-related stress"
  ];

  const handleGetPredictions = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-green p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-semibold text-green-700 text-center mb-8">🌾 Weather Anomalies & Crop Insights</h1>

        {/* Input container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block font-medium mb-2 text-gray-700">Select Region</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">-- Choose a district --</option>
              {allStatesOfIndia.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Select Crop</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="">-- Choose a Crop --</option>
              {crops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Select Timeframe</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="7days">Next 7 Days</option>
              <option value="14days">Next 14 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Select Priority</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Temperature">Temperature</option>
              <option value="Precipitation">Precipitation</option>
              <option value="Humidity">Humidity</option>
            </select>
          </div>
        </div>

        {/* Button */}
        <div className="text-center mb-8">
          <button
            className="bg-green-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
            onClick={handleGetPredictions}
            disabled={!selectedRegion || !selectedCrop}
          >
            Get Predictions
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="max-w-5xl mx-auto mt-8">
          <h2 className="text-3xl font-semibold mb-6 text-green-700">📊 Forecast for {selectedRegion}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockForecast.map((day, idx) => (
              <div key={idx} className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <h3 className="font-semibold text-xl mb-2">{day.date} - {day.condition}</h3>
                <p className="text-sm text-gray-700"> Temp: {day.temp}°C</p>
                <p className="text-sm text-gray-700"> Humidity: {day.humidity}%</p>
                <p className="text-sm text-gray-700"> Precipitation: {day.precip}mm</p>
              </div>
            ))}
          </div>

          <div className="border border-green-700 bg-green-100 p-4 rounded-md mt-12 mb-6">
  <h2 className="text-3xl font-semibold text-green-700">Crop Protection Advice</h2>
</div>

          <div className="bg-green-50 p-6 rounded-lg shadow-md">
            <ul className="list-disc pl-5 space-y-3">
              {mockRecommendations.map((rec, idx) => (
                <li key={idx} className="text-lg text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherAnomalies;
