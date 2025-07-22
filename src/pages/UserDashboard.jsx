/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment } from 'react';
import { data, Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import Header from '../components/Header';

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
        <span className="text-rose-600 font-semibold text-lg">Loading User...</span>
      </div>
    </div>
  );
}

const dummyUser = {
  userId: 'dummy-001',
  name: 'Guest User',
  email: 'guest@example.com',
  badges: ['newBie', 'guest', 'tester'],
  questionsAsked: 2,
  answersGiven: 0,
  myQuestions: [
    {
      questionId: 'q1',
      userId: 'dummy-001',
      title: 'How to reset my password?',
      description: 'I forgot my password. How can I reset it?',
      status: 'Answered',
      createdDate: '2023-06-01T12:00:00Z',
      answers: [
        {
          answerId: 'a1',
          description: 'You can reset your password using the reset link on the login page.',
          createdAt: '2023-06-02T10:00:00Z',
          userId: 'admin-01',
          questionId: 'q1',
        },
      ],
    },
    {
      questionId: 'q2',
      userId: 'dummy-001',
      title: 'What is the refund policy?',
      description: 'Can I get a refund after purchase?',
      status: 'Unanswered',
      createdDate: '2023-07-15T09:30:00Z',
      answers: [],
    },
  ],
};

function UserDashboard() {
  const [user, setUser] = useState({
    userId: 'dummy-001',
    name: 'User Loading ....',
    email: 'Email Loading ....',
    badges: ['newBie', 'guest', 'tester'],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editQuestion, setEditQuestion] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]); // all fetched questions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // Success dialog for delete/update
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('https://helpdesk-production-c4f9.up.railway.app/api/auth/userinfo', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 401) {
            setUser(dummyUser);
            setQuestions(dummyUser.myQuestions);
            setLoading(false);
            return;
          }
          throw new Error(`Failed to fetch user info: ${res.status}`);
        }

        const userData = await res.json();

        const formattedUser = {
          userId: userData.userId,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          department: userData.department,
          batchNo: userData.batchNo,
          roles: userData.roles,
          badges: ['newBie'],
          questionsAsked: 0,
          answersGiven: 0,
          myQuestions: userData.questions,
        };
        setUser(formattedUser);
      } catch (err) {
        console.error(err.message);
        setUser(dummyUser);
        setQuestions(dummyUser.myQuestions);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [editQuestion, questionToDelete]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openEditModal = (question) => {
    setEditQuestion(question);
    setEditedTitle(question.title);
    setEditedDescription(question.description || '');
  };

  const handleSave = () => {
    if (!editQuestion) return;

    setSaving(true); // start saving

    const updatedQuestion = {
      ...editQuestion,
      title: editedTitle,
      description: editedDescription,
    };

    fetch(`https://helpdesk-production-c4f9.up.railway.app/api/questions/${editQuestion.questionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedQuestion),
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to update: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setSuccessMessage('Question updated successfully!');
        setEditQuestion(null);
        setSearchTerm('');
      })
      .catch((err) => {
        alert('Error updating question: ' + err.message);
      })
      .finally(() => {
        setSaving(false); // finish saving
      });
  };


  const confirmDelete = (question) => {
    setQuestionToDelete(question);
    setIsDeleteModalOpen(true);
  };

  const performDelete = () => {
    if (!questionToDelete) return;

    setDeleting(true); // Start loading

    fetch(`https://helpdesk-production-c4f9.up.railway.app/api/questions/${questionToDelete.questionId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to delete: ${res.status}`);
        }
        setSuccessMessage('Question deleted successfully!');
        setEditQuestion(null);
        setSelectedQuestion(null);
        setSearchTerm('');
      })
      .catch((err) => {
        alert('Error deleting question: ' + err.message);
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
        setQuestionToDelete(null);
        setDeleting(false); // End loading
      });
  };

  const handleCardClick = (question) => {
    setSelectedQuestion(question);
  };

  // if (!user) return <LoadingSpinner />;
  // if (loading) return <LoadingSpinner />;

  // Use user.myQuestions if exists; else fallback to filtering questions by user
  const displayedQuestions =
    user?.myQuestions && user.myQuestions.length > 0
      ? user.myQuestions
      : questions.filter((q) => q.userId === user.userId);

  const questionCount = displayedQuestions.length || 0;


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
                  {user.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs mr-2"
                    >
                      {badge}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="font-semibold text-gray-800 mb-1">📊 Stats</h3>
              <p className="text-sm">Questions Asked: {questionCount}</p>
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
                  onChange={handleSearchInputChange}
                />
                <Link to="/ask-question">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm transition">
                    ➕ Ask New Question
                  </button>
                </Link>
              </div>
            </div>

            {/* Questions List or No Data */}
            {displayedQuestions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedQuestions
                  .filter(
                    (q) =>
                      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (q.description &&
                        q.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((q) => (
                    <div
                      key={q.questionId}
                      onClick={() => handleCardClick(q)}
                      className={`cursor-pointer p-4 rounded-xl border-l-4 shadow-sm hover:scale-[1.02] transition ${q.answers && q.answers.length > 0
                        ? 'bg-green-50 border-green-500'
                        : 'bg-yellow-50 border-yellow-500'
                        } relative`}
                    >
                      <p className="font-medium text-gray-800 truncate" title={q.title}>
                        ❓ {q.title}
                      </p>
                      <p className="text-sm text-gray-600 truncate" title={q.description}>
                        📄 {q.description || 'No description'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status:{' '}
                        <span
                          className={`font-semibold ${q.answers && q.answers.length > 0
                            ? 'text-green-600'
                            : 'text-yellow-700'
                            }`}
                        >
                          {q.status}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        📅 {new Date(q.createdDate).toDateString()}
                      </p>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(q);
                        }}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-lg font-bold cursor-pointer"
                        title="Delete Question"
                        aria-label="Delete Question"
                      >
                        &times;
                      </button>

                      {/* Edit button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(q);
                        }}
                        className="absolute bottom-2 right-2 text-blue-600 hover:text-blue-800 text-lg font-bold cursor-pointer"
                        title="Edit Question"
                        aria-label="Edit Question"
                      >
                        ✏️
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <>
                {loading && (
                  <p className="text-center text-gray-500 py-6">
                    <span className="inline-block w-2 h-2 bg-gray-800 rounded-full animate-ping mx-1 ml-4"></span>
                    <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-ping mx-1 delay-200 ml-4"></span>
                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-ping mx-1 delay-400 ml-4"></span>
                  </p>
                )}

                {user?.exist && displayedQuestions.length === 0 && (
                  <p className="text-center text-red-500 py-6">🚫 No questions found.</p>
                )}
              </>
            )}


          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Transition appear show={isDeleteModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={() => setIsDeleteModalOpen(false)}
          >
            <div className="min-h-screen px-4 text-center bg-black/30 backdrop-blur-sm">
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-xl shadow-xl">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    Confirm Delete
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the question:
                    </p>
                    <p className="mt-2 font-medium text-gray-700">
                      "{questionToDelete?.title}"
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded text-white ${deleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                      onClick={performDelete}
                      disabled={deleting}
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* Edit Modal */}
        <Transition appear show={!!editQuestion} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={() => setEditQuestion(null)}
          >
            <div className="min-h-screen px-4 text-center bg-black/30 backdrop-blur-sm">
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-xl shadow-xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 mb-4"
                  >
                    ✏️ Edit Question
                  </Dialog.Title>

                  <div className="mb-3">
                    <label className="text-sm block mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="text-sm block mb-1">Description</label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      rows={4}
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mb-6">
                    📅 {editQuestion && new Date(editQuestion.createdDate).toDateString()}
                  </p>

                  <div className="flex justify-between gap-2">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      onClick={() => confirmDelete(editQuestion)}
                    >
                      Delete
                    </button>
                    <div className="flex gap-2">
                      <button
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => setEditQuestion(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed`}
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>

                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* View Answer Modal */}
        <Transition appear show={!!selectedQuestion} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={() => setSelectedQuestion(null)}
          >
            <div className="min-h-screen px-4 text-center bg-black/30 backdrop-blur-sm">
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-xl shadow-xl">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900 mb-4"
                  >
                    📖 Question Details
                  </Dialog.Title>

                  <p className="mb-2">
                    <strong>❓ Title:</strong> {selectedQuestion?.title}
                  </p>
                  <p className="mb-2">
                    <strong>📄 Description:</strong>{' '}
                    {selectedQuestion?.description || 'No description'}
                  </p>
                  <p className="mb-2">
                    <strong>📅 Date:</strong>{' '}
                    {selectedQuestion &&
                      new Date(selectedQuestion.createdDate).toDateString()}
                  </p>
                  <p className="mb-2">
                    <strong>📌 Status:</strong>{' '}
                    <span
                      className={`font-semibold ${selectedQuestion?.status === 'Answered'
                        ? 'text-green-600'
                        : 'text-yellow-700'
                        }`}
                    >
                      {selectedQuestion?.status}
                    </span>
                  </p>

                  {selectedQuestion?.answers && selectedQuestion.answers.length > 0 ? (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">
                        ✅ Answers:
                      </h4>
                      <ul className="space-y-3 text-sm text-gray-700">
                        {selectedQuestion.answers.map((answer, index) => (
                          <li
                            key={answer.answerId || index}
                            className="bg-gray-50 border rounded-lg p-3"
                          >
                            <p>{answer.description}</p>
                            <div className="text-xs text-gray-500 mt-1">
                              Posted on:{' '}
                              {new Date(answer.createdAt).toLocaleDateString()}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-red-500 mt-4">
                      No answers provided yet.
                    </p>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* Success Message Dialog */}
        <Transition appear show={!!successMessage} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClose={() => setSuccessMessage(null)}
          >
            <Dialog.Panel className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-5 text-center">
              <p className="text-gray-700">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Close
              </button>
            </Dialog.Panel>
          </Dialog>
        </Transition>
      </div>
    </>
  );
}

export default UserDashboard;
