import React, { useState } from 'react';
import Header from '../components/Header';

function AskQuestion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const availableCategories = ['Timetable', 'Subjects', 'Exams', 'Labs'];

  const handleCategoryChange = (category) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = {
      title,
      description,
      categories,
      isAnonymous,
      postedAt: new Date().toISOString(),
    };
    console.log('Question Submitted:', newQuestion);
    // API call or state update goes here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-blue-100 py-18 text-gray-900">
      {/* Navbar */}
      <Header />

      {/* Ask Question Form */}
      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl transition hover:shadow-2xl duration-300">
        <h2 className="text-2xl font-extrabold mb-6 text-blue-700">Ask a Question</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Question Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., How to register for lab sessions?"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Provide more details about your question..."
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Categories</label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => (
                <label
                  key={cat}
                  className={`cursor-pointer px-4 py-2 rounded-full border text-sm font-medium transition ${
                    categories.includes(cat)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={categories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={() => setIsAnonymous(!isAnonymous)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Post anonymously
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-2 rounded-full text-sm font-semibold transition-shadow shadow-md hover:shadow-lg"
            >
               Submit Question 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AskQuestion;
