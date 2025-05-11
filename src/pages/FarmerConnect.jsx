import React, { useState } from 'react';

const samplePosts = [
  {
    id: 1,
    title: "Unexpected Rainfall in Maharashtra – Any tips?",
    author: "RaviKisan98",
    tags: ["#Weather", "#Rain"],
    region: "Maharashtra",
    snippet: "The last few days have brought untimely rains affecting my wheat crops. Looking for suggestions...",
  },
  {
    id: 2,
    title: "Which fertilizer works best for organic tomatoes?",
    author: "GreenRootsFarmer",
    tags: ["#Organic", "#Fertilizer", "#Crops"],
    region: "Punjab",
    snippet: "I've been trying to move to organic farming. Need advice on organic-friendly fertilizers for tomatoes.",
  },
  {
    id: 3,
    title: "Pest problem in cotton fields",
    author: "KisanStrong24",
    tags: ["#Pests", "#Cotton", "#Help"],
    region: "Telangana",
    snippet: "Whiteflies have attacked my cotton field again this year. What organic solutions can I try?",
  },
  {
    id: 4,
    title: "Efficient irrigation techniques for small farms?",
    author: "WaterWiseFarmer",
    tags: ["#Irrigation", "#Sustainability", "#WaterManagement"],
    region: "Rajasthan",
    snippet: "My water resources are limited. Can anyone share ideas on how to irrigate efficiently on a small budget?",
  },
  {
    id: 5,
    title: "How to prepare for unseasonal temperature rise?",
    author: "FutureAgroTech",
    tags: ["#ClimateChange", "#Temperature", "#Adaptation"],
    region: "Uttar Pradesh",
    snippet: "The weather forecast is predicting a sudden temperature spike. What protective measures can I take for my crops?",
  }
];

function FarmerConnect() {
  const [posts, setPosts] = useState(samplePosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    author: '',
    region: '',
    snippet: '',
    tags: '',
  });

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.author || !newPost.region || !newPost.snippet) return;
    const formattedTags = newPost.tags
      ? newPost.tags.split(',').map((tag) => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`)
      : [];

    setPosts([
      {
        id: posts.length + 1,
        title: newPost.title,
        author: newPost.author,
        region: newPost.region,
        snippet: newPost.snippet,
        tags: formattedTags,
      },
      ...posts,
    ]);
    setShowModal(false);
    setNewPost({ title: '', author: '', region: '', snippet: '', tags: '' });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-green-700 mb-4">🌾 Farmer Connect Forum</h2>
      <p className="mb-6 text-gray-700">
        A space for farmers to share issues, ask questions, and support each other across India. 🌦️
      </p>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search discussions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Create Post Button */}
      <div className="mb-8 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          + Create New Post
        </button>
      </div>

      {/* Forum Posts */}
      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-5 border border-green-300 rounded-xl shadow-md hover:shadow-lg transition bg-green-100 bg-opacity-80"
          >
            <h3 className="text-xl font-semibold text-green-800">{post.title}</h3>
            <p className="text-sm text-gray-600 mt-1 mb-2">by {post.author} | 📍 {post.region}</p>
            <p className="text-gray-700 mb-2">{post.snippet}</p>
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion */}
      <div className="mt-12 text-center text-sm text-gray-500 italic">
        Want to contribute? Post your doubts, solutions, or experiences to help the community grow.
      </div>

      {/* Create Post Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-green-700">Create New Post</h3>

            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Your Name"
              value={newPost.author}
              onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Region (e.g., Bihar)"
              value={newPost.region}
              onChange={(e) => setNewPost({ ...newPost, region: e.target.value })}
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <textarea
              placeholder="Your post..."
              value={newPost.snippet}
              onChange={(e) => setNewPost({ ...newPost, snippet: e.target.value })}
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated like #Rain,#Climate)"
              value={newPost.tags}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              className="w-full mb-4 p-2 border rounded-lg"
            />

            <div className="flex justify-end gap-3">
              <button
                className="text-gray-500 hover:underline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmerConnect;
