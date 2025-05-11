import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function CropRecommendation() {
  const [formData, setFormData] = useState({ N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '' });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  const languages = {
    en: 'English', hi: 'हिंदी (Hindi)', es: 'Español (Spanish)', fr: 'Français (French)'
  };
  const cropManualResponses = {
  en: {
    "cotton": "Cotton is a kharif crop grown between April-May. It requires:\n- Temperature: 21-30°C\n- Rainfall: 50-100cm\n- Soil: Black soil\nMajor producers: India, USA, China",
    "wheat": "Wheat is a rabi crop sown in winter (Oct-Dec). It needs:\n- Temperature: 14-18°C\n- Rainfall: 50-75cm\n- Soil: Loamy soil\nTop varieties: HD 2967, PBW 550",
    "rice": "Rice grows best in:\n- Temperature: 20-35°C\n- Rainfall: 150-300cm\n- Soil: Clayey loam\nIndia's staple food crop"
  },
  hi: {
    "cotton": "कपास एक खरीफ फसल है (अप्रैल-मई)। आवश्यकताएँ:\n- तापमान: 21-30°C\n- वर्षा: 50-100cm\n- मिट्टी: काली मिट्टी\nप्रमुख उत्पादक: भारत, अमेरिका, चीन",
    "wheat": "गेहूं रबी फसल है (अक्टूबर-दिसंबर)। आवश्यकताएँ:\n- तापमान: 14-18°C\n- वर्षा: 50-75cm\n- मिट्टी: दोमट मिट्टी\nप्रमुख किस्में: HD 2967, PBW 550"
  }
  // Add other languages if needed
};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, when: 'beforeChildren' } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } }
  };
  const chatVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    exit: { y: 100, opacity: 0 }
  };

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([{ text: getWelcomeMessage(language), sender: 'bot', timestamp: new Date() }]);
    }
  }, [chatOpen, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWelcomeMessage = (lang) => {
    const messages = {
      en: "Hello! I'm your crop assistant. How can I help you today?",
      hi: "नमस्ते! मैं आपका कृषि सहायक हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?",
      es: "¡Hola! Soy tu asistente de cultivos. ¿Cómo puedo ayudarte hoy?",
      fr: "Bonjour! Je suis votre assistant agricole. Comment puis-je vous aider aujourd'hui?"
    };
    return messages[lang] || messages.en;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const userMessage = { text: inputMessage, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsBotTyping(true);
    try {
      const botResponse = await fetchAnswerFromAI(inputMessage);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot', timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { text: 'Sorry, I encountered an error. Please try again later.', sender: 'bot', timestamp: new Date() }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const fetchAnswerFromAI = async (userInput) => {
  // Convert to lowercase and remove extra spaces
  const cleanInput = userInput.toLowerCase().trim();
  
  // 1. First check manual responses
  for (const [crop, response] of Object.entries(cropManualResponses[language])) {
    if (cleanInput.includes(crop)) {
      return response;
    }
  }

  // 2. If no manual response, try API
  try {
    // Verify API key is loaded
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error("API key not configured");
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an agricultural expert. Answer concisely about crops."
          },
          {
            role: "user",
            content: userInput
          }
        ],
        max_tokens: 150
      },
      {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("API Error:", error);
    return "I can't access detailed info right now. Here are some crops I know about: cotton, wheat, rice. Ask specifically about one.";
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const numericData = Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, parseFloat(v)]));
      const response = await axios.post('http://localhost:6000/predict', numericData);
      if (response.data.status === 'success') {
        setPrediction(response.data.prediction);
      } else {
        throw new Error(response.data.error || 'Prediction failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen p-6 bg-green-50/30 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }}>
        <h1 className="text-3xl font-bold text-center text-green-800 mb-2">Crop Recommendation</h1>
        <p className="text-xl font-bold text-center text-emerald-500 mb-6">Enter soil and weather conditions to get the best crop recommendation!</p>
      </motion.div>

      <motion.form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[{ name: 'N', label: 'Nitrogen (N)' }, { name: 'P', label: 'Phosphorus (P)' }, { name: 'K', label: 'Potassium (K)' }, { name: 'temperature', label: 'Temperature (°C)' }, { name: 'humidity', label: 'Humidity (%)' }, { name: 'ph', label: 'pH Level' }, { name: 'rainfall', label: 'Rainfall (mm)' }].map(field => (
            <motion.div key={field.name} variants={itemVariants}>
              <label className="block text-gray-700 font-semibold mb-1">{field.label}</label>
              <input type="number" step="0.1" min="0" name={field.name} value={formData[field.name]} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" />
            </motion.div>
          ))}
        </motion.div>
        <motion.button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {loading ? 'Predicting...' : 'Get Recommendation'}
        </motion.button>
        {error && <p className="text-red-600 font-semibold text-center">{error}</p>}
        {prediction && (
          <motion.div className="text-center text-2xl font-bold text-green-800 mt-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 100 }}>
            Recommended Crop: {prediction}
          </motion.div>
        )}
      </motion.form>

      <AnimatePresence>
        {chatOpen && (
          <motion.div className="fixed bottom-20 right-6 bg-white border rounded-lg shadow-lg w-80 max-h-[70vh] flex flex-col overflow-hidden" variants={chatVariants} initial="hidden" animate="visible" exit="exit">
            <div className="bg-green-600 text-white p-3 flex justify-between items-center">
              <span>Chat Assistant</span>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-white text-black rounded p-1">
                {Object.entries(languages).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              {messages.map((msg, idx) => (
                <motion.div key={idx} className={`p-2 rounded-lg max-w-xs ${msg.sender === 'bot' ? 'bg-gray-100 self-start' : 'bg-green-100 self-end'}`} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  {msg.text}
                </motion.div>
              ))}
              {isBotTyping && <p className="text-sm italic text-gray-500">Bot is typing...</p>}
              <div ref={messagesEndRef} />
            </div>
            <form className="p-3 bg-gray-50 flex" onSubmit={handleSendMessage}>
              <input type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)} placeholder="Type your message..." className="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none" />
              <button type="submit" className="bg-green-600 text-white p-2 rounded-r-lg">Send</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button onClick={() => setChatOpen(!chatOpen)} className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700">
        {chatOpen ? 'Close Chat' : 'Open Chat'}
      </motion.button>
    </motion.div>
  );
}

export default CropRecommendation;
