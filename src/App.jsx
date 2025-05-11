import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

import HomePage from '@/pages/HomePage';
import CropRecommendation from '@/pages/CropRecommendation';
import CrossBreeding from '@/pages/CrossBreeding';
import PricePredictor from '@/pages/PricePredictor';
import WeatherAnomalies from '@/pages/WeatherAnomalies';
import FarmerConnect from '@/pages/FarmerConnect';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Onboarding from '@/pages/Onboarding';
import agrisetuLogo from '@/assets/agrisetu.png';

function App() {
  return (
    <Router>
      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://img.freepik.com/premium-photo/view-soybean-farm-agricultural-field-against-sky-aesthetic-look_629685-13949.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-white/30"></div>

        <div className="relative z-10 min-h-screen text-gray-800">
          {/* Navigation Bar */}
          <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src={agrisetuLogo}
                  alt="AgriSetu Logo"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="text-2xl font-bold text-green-400">AgriSetu</div>
              </div>

              <ul className="flex space-x-6">
                <li>
                  <NavLink to="/" end className={({ isActive }) => (isActive ? 'text-green-400' : 'hover:text-green-400 transition-all')}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/crop-recommendation" className={({ isActive }) => (isActive ? 'text-green-400' : 'hover:text-green-400 transition-all')}>
                    Crop Recommendation
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/cross-breeding" className={({ isActive }) => (isActive ? 'text-green-400' : 'hover:text-green-400 transition-all')}>
                    Cross Breeding
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/price-predictor" className={({ isActive }) => (isActive ? 'text-green-400' : 'hover:text-green-400 transition-all')}>
                    Price Predictor
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/weather-anomalies" className={({ isActive }) => (isActive ? 'text-green-400' : 'hover:text-green-400 transition-all')}>
                    Weather Anomalies
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/farmer-connect" className={({ isActive }) => (isActive ? 'text-green-400' : 'hover:text-green-400 transition-all')}>
                    Farmer Connect Forum
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>

          {/* Page Content */}
          <main className="px-6 py-10 max-w-6xl mx-auto">
            <Routes>
              {/* ✅ All Pages Now Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/crop-recommendation" element={<CropRecommendation />} />
              <Route path="/cross-breeding" element={<CrossBreeding />} />
              <Route path="/price-predictor" element={<PricePredictor />} />
              <Route path="/weather-anomalies" element={<WeatherAnomalies />} />
              <Route path="/farmer-connect" element={<FarmerConnect />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
