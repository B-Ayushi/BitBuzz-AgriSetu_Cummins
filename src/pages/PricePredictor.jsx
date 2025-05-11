import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function PricePredictor() {
  const [crops, setCrops] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiBase = 'http://localhost:5003';

  useEffect(() => {
    axios.get(`${apiBase}/api/price/crops`)
      .then(res => setCrops(res.data))
      .catch(() => setError("Failed to load crops"));

    axios.get(`${apiBase}/api/price/states`)
      .then(res => setStates(res.data))
      .catch(() => setError("Failed to load states"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCrop || !selectedState) return;

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const res = await axios.post(`${apiBase}/api/price/predict`, {
        crop: selectedCrop,
        state: selectedState
      });
      setPrediction(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-green py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-4xl font-extrabold text-green-700 text-center mb-3">🌾 Price Predictor</h2>
      <p className="text-center text-lg text-gray-600 mb-10">
        Select your crop and state to view the upcoming market trend!
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-2xl mx-auto p-8 rounded-2xl shadow-xl space-y-6 border border-green-100"
      >
        <div>
          <label className="block text-gray-800 font-semibold mb-2">Crop</label>
          <select
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            required
          >
            <option value="">-- Select Crop --</option>
            {crops.map((crop, i) => (
              <option key={i} value={crop}>{crop}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-800 font-semibold mb-2">State</label>
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            required
          >
            <option value="">-- Select State --</option>
            {states.map((state, i) => (
              <option key={i} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out disabled:opacity-50"
        >
          {loading ? 'Predicting...' : 'Predict Price'}
        </button>
      </form>

      {error && (
        <p className="text-red-600 text-center font-medium mt-6">{error}</p>
      )}

      {prediction && (
        <motion.div
          className="mt-10 max-w-xl mx-auto bg-white border border-green-200 rounded-2xl p-6 text-center shadow-lg"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h3 className="text-2xl font-bold text-green-700 mb-2">
            📍 Predicted Price for {prediction.crop} in {prediction.state}
          </h3>
          <p className="text-3xl text-green-600 font-extrabold mb-1">
            ₹ {prediction.predicted_price} / quintal
          </p>
          <p className="text-sm text-gray-600">
            📊 Trend: <span className="font-semibold capitalize">{prediction.trend}</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default PricePredictor;
