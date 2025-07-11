import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [matchedQuestion, setMatchedQuestion] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // On component mount, load user from sessionStorage
  useEffect(() => {
    const storedUserString = sessionStorage.getItem('currentUser');
    if (storedUserString) {
      try {
        const storedUser = JSON.parse(storedUserString);
        setUser(storedUser);
      } catch (e) {
        console.error('Failed to parse user from sessionStorage', e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim().length > 0 && user?.myQuestions) {
      const match = user.myQuestions.find((q) =>
        q.title.toLowerCase().includes(term.toLowerCase())
      );
      setMatchedQuestion(match || null);
      if (match) setEditedTitle(match.title);
    } else {
      setMatchedQuestion(null);
    }
  };

  const handleSave = () => {
    if (!matchedQuestion) return;

    // Update the matched question's title locally
    const updatedQuestions = user.myQuestions.map((q) =>
      q.title === matchedQuestion.title ? { ...q, title: editedTitle } : q
    );

    const updatedUser = {
      ...user,
      myQuestions: updatedQuestions,
    };

    setUser(updatedUser);
    setMatchedQuestion(null);
    setSearchTerm('');

    // Update sessionStorage with updated user data
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));

    alert(`Title updated to: ${editedTitle}`);
  };

  const handleCardClick = (question) => {
    setSelectedQuestion(question);
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          <p>No user data found. Please log in.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 pt-24 px-4 pb-10">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Profile */}
          <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-16 h-16 bg-yellow-400 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                👤
              </div>
              <div>
                <p className="text-xl font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">📧 {user.email}</p>
                <p className="mt-2 text-sm text-gray-700">
                  🏅 Badges:{' '}
                  {Array.isArray(user.badges) && user.badges.length > 0 ? (
                    user.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs mr-2"
                      >
                        {badge}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs italic">No badges earned yet</span>
                  )}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="font-semibold text-gray-800 mb-1">📊 Stats</h3>
              <p className="text-sm">Questions Asked: {user.questionsAsked || 0}</p>
              <p className="text-sm">Answers Given: {user.answersGiven || 0}</p>
            </div>
          </div>

          {/* My Questions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-800">📝 My Questions</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="🔍 Search my questions..."
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Link to="/ask-question">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm transition">
                    ➕ Ask New Question
                  </button>
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.myQuestions && user.myQuestions.length > 0 ? (
                user.myQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCardClick(q)}
                    className={`cursor-pointer p-4 rounded-xl border-l-4 shadow-sm hover:scale-[1.02] transition ${q.status === 'Answered' ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'
                      }`}
                  >
                    <p className="font-medium text-gray-800 truncate" title={q.title}>
                      ❓ {q.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:{' '}
                      <span
                        className={`font-semibold ${q.status === 'Answered' ? 'text-green-600' : 'text-yellow-700'
                          }`}
                      >
                        {q.status}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">📅 {q.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">You have not asked any questions yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {matchedQuestion && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-lg shadow-xl relative">
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                onClick={() => {
                  setMatchedQuestion(null);
                  setSearchTerm('');
                }}
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4">✏️ Edit Question</h3>
              <div className="mb-3">
                <label className="text-sm block mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-700">Status: {matchedQuestion.status}</p>
              <p className="text-xs text-gray-500 mb-4">📅 {matchedQuestion.date}</p>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setMatchedQuestion(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Answer Modal */}
        {selectedQuestion && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-lg relative">
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                onClick={() => setSelectedQuestion(null)}
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">📖 Question Details</h3>
              <p className="mb-2"><strong>❓ Title:</strong> {selectedQuestion.title}</p>
              <p className="mb-2"><strong>📅 Date:</strong> {selectedQuestion.date}</p>
              <p className="mb-2">
                <strong>📌 Status:</strong>{' '}
                <span className={`font-semibold ${selectedQuestion.status === 'Answered' ? 'text-green-600' : 'text-yellow-700'}`}>
                  {selectedQuestion.status}
                </span>
              </p>
              {selectedQuestion.answers.length > 0 ? (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">✅ Answers:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                    {selectedQuestion.answers.map((ans, i) => (
                      <li key={i}>{ans}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-red-500 mt-4">No answers provided yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserDashboard;
