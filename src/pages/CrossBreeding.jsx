import React, { useState, useEffect } from 'react';

function CrossBreeding() {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [priority, setPriority] = useState("Yield");
  const [activeTab, setActiveTab] = useState("recommendations");
  const [selectedHybrids, setSelectedHybrids] = useState([]);
  const [cropOptions, setCropOptions] = useState(["All"]);
  const [regionOptions, setRegionOptions] = useState(["All"]);
  const [recommendations, setRecommendations] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  // API configuration - using port 6000 and updated endpoint
  const API_URL = 'http://localhost:7000/api';

  // Load initial data (crops and regions)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${API_URL}/data`);
        const result = await response.json();
        
        if (result.success) {
          setCropOptions(["All", ...result.data.crops]);
          setRegionOptions(["All", ...result.data.regions]);
        } else {
          setError(result.error || 'Failed to load data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Get recommendations when filters change
  useEffect(() => {
    if (activeTab === 'recommendations') {
      const fetchRecommendations = async () => {
        try {
          setLoading(true);
          const queryMap = {
            "Yield": "high yield",
            "Disease Resistance": "disease resistant",
            "Early Maturity": "early maturity"
          };

          const response = await fetch(`${API_URL}/recommend`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_input: queryMap[priority],
              selected_crop: selectedCrop
            })
          });

          const result = await response.json();
          
          if (result.success) {
            setRecommendations(result.data);
            setError(null);
          } else {
            setError(result.error || 'Failed to get recommendations');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchRecommendations();
    }
  }, [activeTab, priority, selectedCrop]);

  // Get comparison data when filters change
  useEffect(() => {
    if (activeTab === 'compare') {
      const fetchComparisonData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_URL}/compare`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              selected_crop: selectedCrop,
              selected_region: selectedRegion,
              hybrids: selectedHybrids
            })
          });

          const result = await response.json();
          
          if (result.success) {
            setComparisonData(result.data);
            setError(null);
          } else {
            setError(result.error || 'Failed to get comparison data');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchComparisonData();
    }
  }, [activeTab, selectedCrop, selectedRegion, selectedHybrids]);

  // Handle hybrid selection for comparison
  const handleHybridSelection = (hybrid) => {
    setSelectedHybrids(prev => {
      if (prev.includes(hybrid)) {
        return prev.filter(h => h !== hybrid);
      } else if (prev.length < 5) {
        return [...prev, hybrid];
      }
      return prev;
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      Error: {error}
    </div>
  );

  return (
    <div className="bg-green-50/30 min-h-screen p-4">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          🌾 Smart Crop Breeding Recommendation
        </h1>
        <p className="text-center font-bold text-green-900 mb-8">
          Helping farmers choose the perfect hybrid seeds for their needs
        </p>

        {/* Sidebar Filters */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 bg-green-50/70 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🔍 Filter Options</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Crop</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                {cropOptions.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Region</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regionOptions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Priority</label>
              <div className="space-y-2">
                {["Yield", "Disease Resistance", "Early Maturity"].map(opt => (
                  <div key={opt} className="flex items-center">
                    <input
                      type="radio"
                      id={opt}
                      name="priority"
                      checked={priority === opt}
                      onChange={() => setPriority(opt)}
                      className="mr-2"
                    />
                    <label htmlFor={opt}>{opt}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {/* Tabs */}
            <div className="flex border-b mb-6">
              {[
                { id: "recommendations", label: "🌱 Hybrid Recommendations" },
                { id: "compare", label: "📊 Compare Varieties" },
                { id: "traits", label: "🧪 Traits Summary" }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 font-medium ${activeTab === tab.id ?
                    "text-green-600 border-b-2 border-green-600" :
                    "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "recommendations" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Top Hybrids For You</h2>

                {recommendations.length === 0 ? (
                  <p className="text-yellow-600">
                    No {selectedCrop !== 'All' ? selectedCrop : ''} hybrids found with '{priority}' characteristics
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((item, index) => (
                      <div key={index} className="bg-green-50/70 p-4 rounded-lg shadow">
                        <h3 className="font-bold text-lg">
                          🏆 {item.Hybrid} ({item.Crop}) - Score: {item.Match_Score?.toFixed(2) || 'N/A'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <h4 className="font-semibold">Benefits:</h4>
                            <ul className="list-disc pl-5">
                              <li>{item.Benefit1}</li>
                              <li>{item.Benefit2}</li>
                              <li>{item.Benefit3}</li>
                            </ul>
                            <p className="mt-2"><strong>Region:</strong> {item.Region}</p>
                            <p><strong>Duration:</strong> {item.Duration}</p>
                          </div>

                          <div>
                            <p><strong>Yield:</strong> {item.Yield}</p>
                            <p><strong>Disease Resistance:</strong> {item.DiseaseResistance}</p>
                            <p><strong>Special Features:</strong> {item.SpecialFeatures}</p>
                          </div>
                        </div>

                        {item.Vendors !== "Not Specified" ? (
                          <div className="mt-3 p-2 bg-green-100 text-green-800 rounded">
                            <strong>Buy from:</strong> {item.Vendors}
                          </div>
                        ) : (
                          <div className="mt-3 p-2 bg-yellow-100 text-yellow-800 rounded">
                            Vendor information not available
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "compare" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Compare Varieties</h2>
                <div className="space-y-4">
                  <div className="bg-green-50/70 p-4 rounded-lg shadow">
                    <label className="block text-gray-700 mb-2">Select hybrids to compare (max 5)</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {comparisonData.map(item => (
                        <button
                          key={item.Hybrid}
                          onClick={() => handleHybridSelection(item.Hybrid)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedHybrids.includes(item.Hybrid)
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                        >
                          {item.Hybrid}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedHybrids.length > 0 && (
                    <div className="bg-green-50/70 p-4 rounded-lg shadow">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left">Hybrid</th>
                              <th className="px-4 py-2 text-left">Crop</th>
                              <th className="px-4 py-2 text-left">Benefit1</th>
                              <th className="px-4 py-2 text-left">Benefit2</th>
                              <th className="px-4 py-2 text-left">Yield</th>
                              <th className="px-4 py-2 text-left">Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comparisonData
                              .filter(item => selectedHybrids.includes(item.Hybrid))
                              .map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                  <td className="px-4 py-2">{item.Hybrid}</td>
                                  <td className="px-4 py-2">{item.Crop}</td>
                                  <td className="px-4 py-2">{item.Benefit1}</td>
                                  <td className="px-4 py-2">{item.Benefit2}</td>
                                  <td className="px-4 py-2">{item.Yield}</td>
                                  <td className="px-4 py-2">{item.Duration}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6 h-64">
                        <h3 className="font-semibold mb-2">Yield Comparison</h3>
                        <div className="bg-white p-4 rounded h-full">
                          <div className="flex items-end h-48 gap-2 pt-4">
                            {comparisonData
                              .filter(item => selectedHybrids.includes(item.Hybrid))
                              .map((item, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                  <div 
                                    className="w-full bg-green-500 rounded-t"
                                    style={{ 
                                      height: `${(parseFloat(item.Yield) || 0) * 5}px`,
                                      maxHeight: '100%'
                                    }}
                                  ></div>
                                  <div className="text-xs mt-1 text-center">{item.Hybrid}</div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "traits" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Traits Summary</h2>
                <div className="bg-green-50/70 p-4 rounded-lg shadow overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Hybrid</th>
                        <th className="px-4 py-2">Crop</th>
                        <th className="px-4 py-2">Benefit1</th>
                        <th className="px-4 py-2">Benefit2</th>
                        <th className="px-4 py-2">Benefit3</th>
                        <th className="px-4 py-2">Disease Resistance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.slice(0, 10).map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="px-4 py-2">{item.Hybrid}</td>
                          <td className="px-4 py-2">{item.Crop}</td>
                          <td className="px-4 py-2">{item.Benefit1}</td>
                          <td className="px-4 py-2">{item.Benefit2}</td>
                          <td className="px-4 py-2">{item.Benefit3}</td>
                          <td className="px-4 py-2">{item.DiseaseResistance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
          Data sources: ICAR, ICRISAT, Seed Companies | © 2024 AgriTech Advisor
        </div>
      </div>
    </div>
  );
}

export default CrossBreeding;