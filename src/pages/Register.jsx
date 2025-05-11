import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

function Register({ onRegisterSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [popupType, setPopupType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match!");
      setPopupType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setMessage(res.data.message);
      setPopupType('success');
      setTimeout(() => setMessage(''), 3000);

      onRegisterSuccess(); // Update App's auth state
      navigate('/onboarding'); // Go to onboarding page

    } catch (err) {
      setMessage(err.response?.data?.error || 'Registration failed');
      setPopupType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <motion.div
      className="bg-green-100 p-10 rounded-xl shadow-xl w-full max-w-md mx-auto mt-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Join Us! 🌾</h2>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-gray-700 font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {message && (
          <p className={`text-center ${popupType === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-all"
        >
          Register
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <span
          className="text-green-500 font-medium cursor-pointer hover:underline"
          onClick={() => navigate('/login')}
        >
          Log in
        </span>
      </p>
    </motion.div>
  );
}

export default Register;
