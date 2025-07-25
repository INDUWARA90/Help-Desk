import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import ThankYou from '../components/ThankYou';
import AnswerModal from '../components/AnswerModal';

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex items-center space-x-3">
        <svg className="animate-spin h-10 w-10 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="text-rose-600 font-semibold text-lg">Loading question...</span>
      </div>
    </div>
  );
}

function SingleQuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [userMap, setUserMap] = useState({});

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const token = localStorage.getItem('authToken');

  // Helper function to build headers for fetch
  const getHeaders = (isJson = false) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (isJson) headers['Content-Type'] = 'application/json';
    return headers;
  };

  // Fetch user info for all answer authors
  const fetchUserNames = async (answers) => {
    const ids = [...new Set(answers.map((a) => a.userId))];
    const promises = ids.map((uid) =>
      fetch(`https://helpdesk-production-c4f9.up.railway.app/api/users/${uid}`, {
        headers: getHeaders(),
      })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null)
    );

    const results = await Promise.all(promises);
    const map = {};
    results.forEach((user, index) => {
      if (user) {
        map[ids[index]] = user;
      }
    });
    setUserMap(map);
  };

  // Fetch question and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://helpdesk-production-c4f9.up.railway.app/api/questions/${id}`, {
          headers: getHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch question');
        const data = await res.json();
        setQuestion(data);
        await fetchUserNames(data.answers || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!currentUser) {
      alert('Please log in to submit a question.');
      return;
    }

    const newAnswer = {
      answerId: 0,
      description: answer,
      anonymous: isAnonymous,
      createdAt: new Date().toISOString(),
      vote: 0,
      userId: currentUser.userId,
      questionId: parseInt(id),
    };

    try {
      const res = await fetch('https://helpdesk-production-c4f9.up.railway.app/api/answers', {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(newAnswer),
      });

      if (!res.ok) throw new Error('Failed to submit answer');
      await res.json();

      const updatedRes = await fetch(`https://helpdesk-production-c4f9.up.railway.app/api/questions/${id}`, {
        headers: getHeaders(),
      });
      const updatedQuestion = await updatedRes.json();
      setQuestion(updatedQuestion);
      await fetchUserNames(updatedQuestion.answers || []);

      setAnswer('');
      setIsAnonymous(false);
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 1500);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  if (!question) return <LoadingSpinner />;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-blue-100 text-black font-sans">
        <div className="py-9" />

        <div className="mt-6 px-6 md:px-16 mb-13">
          <Link to="/all-questions">
            <button className="flex items-center gap-2 text-base text-rose-600 hover:text-rose-800 transition duration-200 cursor-pointer">
              <span>🔙</span>
              <span>Back to All Questions</span>
            </button>
          </Link>
        </div>

        <div className="flex justify-center px-6 md:px-0 py-1">
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full md:w-1/2 space-y-8 border border-rose-100 transition hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-inner">
                {question.anonymous ? '?' : (question.userName?.charAt(0).toUpperCase() || 'U')}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">{question.title}</h2>
            </div>

            {/* Description */}
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-medium text-gray-600">Description:</p>
                <p className="italic text-base">"{question.description}"</p>
              </div>

              <div>
                <p className="font-medium text-gray-600">Category:</p>
                <p className="text-rose-600 font-semibold text-base">
                  #{['Timetable', 'Exams', 'Labs', 'Subjects'][question.categoryId - 1] || 'General'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between text-base text-gray-700 items-center gap-2">
                <p>📅 Posted: {new Date(question.createdDate).toLocaleDateString()}</p>
                <p className="font-semibold flex items-center">
                  Status:
                  <span
                    className={`ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                      question.answers.length > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {question.answers.length > 0 ? '✅ Answered' : '❓ Unanswered'}
                  </span>
                </p>
              </div>
            </div>

            {/* Answers */}
            <div className="bg-white/60 rounded-xl p-4 shadow-inner border border-gray-200">
              <h3 className="text-lg font-semibold text-rose-600 mb-3">📢 Answers</h3>
              <div className="space-y-2">
                {question.answers.length > 0 ? (
                  question.answers.map((ans, idx) => (
                    <div key={idx} className="border-l-4 border-rose-400 pl-4">
                      <p className="font-medium text-gray-800">
                        {ans.anonymous
                          ? 'Anonymous'
                          : userMap[ans.userId]
                          ? `${userMap[ans.userId].firstName} ${userMap[ans.userId].lastName}`
                          : 'Unknown User'}
                      </p>
                      <p className="italic text-gray-700 text-base">"{ans.description}"</p>
                      <p className="text-xs text-gray-500 mt-1">🕒 {new Date(ans.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="italic text-gray-500">No answers yet.</p>
                )}
              </div>
            </div>

            {/* Answer Button */}
            <div className="text-center pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white py-3 px-6 rounded-full text-sm shadow-md transition-all duration-300 transform hover:scale-105"
              >
                💬 You want to answer
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <AnswerModal
            answer={answer}
            setAnswer={setAnswer}
            isAnonymous={isAnonymous}
            setIsAnonymous={setIsAnonymous}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
          />
        )}

        {/* Thank You */}
        {showThankYou && <ThankYou />}
      </div>
    </>
  );
}

export default SingleQuestionPage;
