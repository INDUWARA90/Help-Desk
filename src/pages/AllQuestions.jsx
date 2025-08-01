import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import QuestionCard from "../components/QuestionCard";


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
        <span className="text-rose-600 font-semibold text-lg">Loading questions...</span>
      </div>
    </div>
  );
}

// Dummy data to show when user is NOT logged in
const dummyQuestions = [
  {
    questionId: 1,
    title: "How do I reset my password?",
    description: "I forgot my password and can't log in. What do I do?",
    status: "Answered",
    createdDate: "2025-07-15T10:00:00Z",
    answers: [{ description: "Use the 'Forgot Password' link on login." }],
    userId: 0,
  },
  {
    questionId: 2,
    title: "Where can I find the exam timetable?",
    description: "Looking for the exam timetable for this semester.",
    status: "Unanswered",
    createdDate: "2025-07-10T09:00:00Z",
    answers: [],
    userId: 0,
  },
  {
    questionId: 3,
    title: "Can I attend lab sessions online?",
    description: "Are lab sessions available online or only in person?",
    status: "Answered",
    createdDate: "2025-07-13T15:30:00Z",
    answers: [{ description: "Labs are in-person only." }],
    userId: 0,
  },
];

function AllQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = sessionStorage.getItem("currentUser");
    const token = localStorage.getItem("authToken");

    if (currentUser && token) {
      // User logged in — fetch real questions with Authorization header
      fetch("https://helpdesk-production-c4f9.up.railway.app/api/questions", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.status);
          }
          return response.json();
        })
        .then((data) => {
          setQuestions(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      // User not logged in — show dummy data immediately
      setQuestions(dummyQuestions);
      setLoading(false);
    }
  }, []);
  
  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-blue-100 text-gray-800 py-20 mt-20">
      {/* Navbar */}
      <Header />

      {/* Upper section {search box and Filtering} */}

      {/* <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-8">
        <input
          type="text"
          placeholder="🔍 Search questions..."
          className="px-4 py-3 w-full md:w-1/3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
        />

        <select className="w-full md:w-1/5 p-3 rounded-xl bg-white border border-gray-300 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option>Filter questions</option>
          <option>All</option>
          <option>Answered</option>
          <option>Unanswered</option>
          <option>My Questions</option>
        </select>
      </div> */}

      {/* Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-12">
        {questions.map((question, index) => (
          <QuestionCard key={index} question={question} />
        ))}
      </div>
    </div>
  );
}

export default AllQuestionsPage;
