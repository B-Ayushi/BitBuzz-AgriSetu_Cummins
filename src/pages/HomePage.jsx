import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function HomePage() {
  const navigate = useNavigate();

  const testimonials = [
    {
      quote: 'AgriSetu helped me choose the right crop for the season and increase my yield by 30%!',
      name: 'Ramesh Patel',
      location: 'Gujarat',
    },
    {
      quote: 'Thanks to the price predictor, I sold my produce at the best market rate. This platform is a blessing!',
      name: 'Meena Devi',
      location: 'Uttar Pradesh',
    },
    {
      quote: 'I connected with nearby farmers to share tools and tips. The community feature is amazing!',
      name: 'Sukhbir Singh',
      location: 'Punjab',
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.3,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-green-800 tracking-wide">
        🌾 What Farmers Say About AgriSetu 🌾
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-green-100 shadow-md"
          >
            <p className="text-base text-gray-700 italic leading-relaxed">
              “{testimonial.quote}”
            </p>
            <div className="mt-4 text-right">
              <p className="font-semibold text-gray-800">{testimonial.name}</p>
              <p className="text-sm text-green-600">{testimonial.location}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => navigate('/onboarding')}
          className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow hover:bg-green-700 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default HomePage;
