import React from 'react';
import { Link } from 'react-router-dom';

// Convert ISO date to "x minutes/hours/days ago"
function formatPostedAgo(dateString) {
  const postedDate = new Date(dateString);
  const now = new Date();
  const diffMs = now - postedDate;
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 60) return `${diffMinutes} minute(s) ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour(s) ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day(s) ago`;
}

// Map categoryId to readable name
const categoryMap = {
  0: 'General',
  1: 'Timetable',
  2: 'Exams',
  3: 'Labs',
  4: 'Subjects',
};

function QuestionCard({ question }) {
  const status = question.answers.length > 0 ? 'Answered' : 'Unanswered';
  const categoryName = categoryMap[question.categoryId] || 'Uncategorized';

  return (
    <div
      key={question.questionId}
      className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 border border-rose-100"
    >
      {/* Avatar */}
      <div className="absolute top-4 left-4 bg-rose-400 w-8 h-8 rounded-full text-white flex items-center justify-center font-semibold shadow-md">
        {question.anonymous ? '?' : '👤'}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg mt-6 text-rose-600">
        {question.title}
      </h3>

      {/* Description */}
      <p className="text-sm mt-2 italic text-gray-700">
        "{question.description}"
      </p>

      {/* Category */}
      <div className="mt-4 text-sm text-gray-600 space-x-2">
        <span className="font-medium">Category:</span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
          {categoryName}
        </span>
      </div>

      {/* Status & Time */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <p className="flex items-center gap-1">⏱ {formatPostedAgo(question.createdDate)}</p>
        <p>
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${status === 'Answered'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
              }`}
          >
            {status === 'Answered' ? '✅ Answered' : '❓ Unanswered'}
          </span>
        </p>
      </div>

      {/* View Button */}
      <div className="mt-6 text-right">
        <Link to={`/single-question/${question.questionId}`}>
          <button className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition duration-300 cursor-pointer">
            View Question
          </button>
        </Link>
      </div>
    </div>
  );
}

export default QuestionCard;
