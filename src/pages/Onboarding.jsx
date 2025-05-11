import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    name: 'Crop Recommendation',
    description: 'Get suggestions for ideal crops based on conditions.',
    route: '/crop-recommendation',
  },
  {
    name: 'Cross Breeding',
    description: 'Explore cross breeding techniques for better yields.',
    route: '/cross-breeding',
  },
  {
    name: 'Price Predictor',
    description: 'Predict market prices with our smart tools.',
    route: '/price-predictor',
  },
  {
    name: 'Weather Anomalies',
    description: 'Stay alert with predictive weather insights.',
    route: '/weather-anomalies',
  },
  {
    name: 'Farmer Connect Forum',
    description: 'Connect and collaborate with fellow farmers.',
    route: '/farmer-connect',
  },
];

function Onboarding() {
  const navigate = useNavigate();

  const handleRedirect = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen px-4 py-10 text-center">
      <h1 className="text-4xl font-bold mb-10 text-green-700">Welcome to AgriSetu!</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-80 shadow-green-300 shadow-md p-6 rounded-2xl hover:shadow-xl hover:scale-105 transition-transform cursor-pointer"
            onClick={() => handleRedirect(feature.route)}
          >
            <h2 className="text-xl font-semibold text-green-800 mb-2">{feature.name}</h2>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Onboarding;
