import React, { useEffect, useState } from 'react';
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

// Map departmentId to department name
const departmentMap = {
  1: 'ICT',
  2: 'ET',
  3: 'BST',
};

function QuestionCard({ question }) {
  const [userInfo, setUserInfo] = useState(null);
  const status = question.answers.length > 0 ? 'Answered' : 'Unanswered';
  const categoryName = categoryMap[question.categoryId] || 'Uncategorized';

  useEffect(() => {
    if (!question.anonymous && question.userId !== 0) {
      fetch(`https://helpdesk-production-c4f9.up.railway.app/api/users/${question.userId}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch user');
          return res.json();
        })
        .then((data) => {setUserInfo(data)})
        .catch((err) => console.error('Error fetching user:', err));
    }
  }, [question.userId, question.anonymous]);

  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 border border-rose-100">
      {/* Avatar and User Info */}
      <div className="absolute top-4 left-4 flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md text-white 
            ${question.anonymous ? 'bg-gray-400' : 'bg-rose-500'}`}>
          {question.anonymous ? '?' : '👤'}
        </div>
        <div className="flex flex-col text-xs text-gray-800 font-semibold">
          {question.anonymous ? (
            <>
              <span>Anonymous User</span>
              <span className="text-[10px] text-gray-400 italic">Identity Hidden</span>
            </>
          ) : (
            userInfo && (
              <>
                <span>{userInfo.firstName} {userInfo.lastName}</span>
                <span className="text-[10px] text-gray-500">
                  Batch {userInfo.batch} - {departmentMap[userInfo.departmentId] || 'Unknown'}
                </span>
              </>
            )
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg mt-14 text-rose-600">{question.title}</h3>

      {/* Description */}
      <p className="text-sm mt-2 italic text-gray-700">"{question.description}"</p>

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
          <span className={`inline-block px-3 py-1 text-xs rounded-full font-semibold shadow-sm 
              ${status === 'Answered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {status === 'Answered' ? '✅ Answered' : '❓ Unanswered'}
          </span>
        </p>
      </div>

      {/* View Button */}
      <div className="mt-6 text-right">
        <Link to={`/single-question/${question.questionId}`}>
          <button className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition duration-300">
            View Question
          </button>
        </Link>
      </div>
    </div>
  );
}

export default QuestionCard;
