import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import ThankYou from '../components/ThankYou';
import AnswerModal from '../components/AnswerModal';

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex items-center space-x-3">
        <svg
          className="animate-spin h-10 w-10 text-rose-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
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

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  useEffect(() => {
    fetch(`https://helpdesk-production-c4f9.up.railway.app/api/questions/${id}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setQuestion(data))
      .catch(err => console.error('Error fetching question:', err));
  }, [id]);

  // Async submit handler that returns a promise for modal's await
  const handleSubmit = async () => {
    if (!currentUser) {
      alert('Please log in to submit a question.');
      throw new Error('User not logged in');
    }

    const newAnswer = {
      answerId: 0,
      description: answer,
      createdAt: new Date().toISOString(),
      vote: 0,
      userId: currentUser.userId,
      questionId: parseInt(id),
    };

    const res = await fetch('https://helpdesk-production-c4f9.up.railway.app/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newAnswer),
    });

    if (!res.ok) throw new Error('Failed to submit answer');

    await res.json();

    // Re-fetch updated question
    const updatedRes = await fetch(`https://helpdesk-production-c4f9.up.railway.app/api/questions/${id}`, {
      credentials: 'include',
    });
    const updatedQuestion = await updatedRes.json();
    setQuestion(updatedQuestion);

    // Reset form fields
    setAnswer('');
    setIsAnonymous(false);

    // Show ThankYou message briefly
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 1500);
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
            {/* Question Header */}
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
                  #{question.categoryId === 1 ? 'Timetable' :
                    question.categoryId === 2 ? 'Exams' :
                      question.categoryId === 3 ? 'Labs' :
                        question.categoryId === 4 ? 'Subjects' : 'General'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between text-base text-gray-700 items-center gap-2">
                <p>📅 Posted: {new Date(question.createdDate).toLocaleDateString()}</p>
                <p className="font-semibold flex items-center">
                  Status:
                  <span className={`ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${question.answers.length > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                    }`}>
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
                        {ans.anonymous ? 'Anonymous' : ans.userName || 'Unknown User'}
                      </p>
                      <p className="italic text-gray-700 text-base">"{ans.description}"</p>
                      <p className="text-xs text-gray-500 mt-1">
                        🕒 {new Date(ans.createdAt).toLocaleDateString()}
                      </p>
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
            onSubmit={handleSubmit}  // Async submit
          />
        )}

        {/* Thank You */}
        {showThankYou && <ThankYou />}
      </div>
    </>
  );
}

export default SingleQuestionPage;
