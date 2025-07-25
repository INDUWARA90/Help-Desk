import React, { useState } from 'react';
import Header from '../components/Header';
import { Dialog } from '@headlessui/react';

function AskQuestion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [questionSuccess, setQuestionSuccess] = useState(false);
  const [questionError, setQuestionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryError, setShowCategoryError] = useState(false);
  const [currentUser] = useState(
    JSON.parse(sessionStorage.getItem('currentUser'))
  );

  const availableCategories = ['Timetable', 'Subjects', 'Exams', 'Labs', 'Other'];

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setQuestionError('Please log in to submit a question.');
      return;
    }

    const categoryMap = {
      Timetable: 1,
      Exams: 2,
      Labs: 3,
      Subjects: 4,
      Other: 5,
    };

    const categoryId = selectedCategory ? categoryMap[selectedCategory] : 0;

    if (categoryId === 0) {
      setShowCategoryError(true);
      setQuestionError('Please select a category.');
      return;
    }

    setShowCategoryError(false);

    const newQuestion = {
      questionId: 0,
      title,
      description,
      createdDate: new Date().toISOString(),
      anonymous: isAnonymous,
      vote: 0,
      userId: currentUser.userId,
      categoryId,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      answers: [],
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('https://helpdesk-production-c4f9.up.railway.app/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        setQuestionSuccess(true);
        setTitle('');
        setDescription('');
        setSelectedCategory(null);
        setIsAnonymous(false);
      } else {
        //const errText = await response.text();
        setQuestionError(`Failed to submit question.`);
      }
    } catch (error) {
      setQuestionError(`Something went wrong: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-blue-100 py-18 text-gray-900">
      <Header />

      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-extrabold mb-6 text-blue-700">Ask a Question</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label className="block text-sm font-medium mb-2">Select One Category</label>
            <div className={`flex flex-wrap gap-2 p-2 rounded-xl border ${showCategoryError ? 'border-rose-500' : 'border-transparent'}`}>
              {availableCategories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const isDisabled = selectedCategory !== null && selectedCategory !== cat;

                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    disabled={isDisabled}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition border ${isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : isDisabled
                          ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            {showCategoryError && (
              <p className="text-sm text-rose-600 mt-1">Please select a category.</p>
            )}
          </div>

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

          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-2 rounded-full text-sm font-semibold transition-shadow shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Question 🚀'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Dialog */}
      <Dialog
        open={questionSuccess}
        onClose={() => setQuestionSuccess(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <Dialog.Panel className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-5 text-center">
          <Dialog.Title className="text-2xl font-bold text-emerald-600">
            Question Submitted
          </Dialog.Title>
          <p className="text-gray-700">
            Thank you{!isAnonymous && currentUser?.firstName ? `, ${currentUser.firstName}` : ''}! Your question has been posted.
          </p>
          <button
            onClick={() => setQuestionSuccess(false)}
            className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold shadow-lg transition-all"
          >
            Continue
          </button>
        </Dialog.Panel>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        open={!!questionError}
        onClose={() => setQuestionError('')}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <Dialog.Panel className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-5 text-center">
          <Dialog.Title className="text-2xl font-bold text-rose-600">
            Submission Failed
          </Dialog.Title>
          <p className="text-gray-700">{questionError}</p>
          <button
            onClick={() => setQuestionError('')}
            className="mt-4 px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-semibold shadow-lg transition-all"
          >
            Try Again
          </button>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

export default AskQuestion;
