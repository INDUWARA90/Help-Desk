import React from 'react';
import LeaderCard from '../components/LeaderCard';
import Header from '../components/Header';

const mockLeaderboardData = [
  {
    id: 1,
    name: 'Mentor_C',
    email: 'mentor.c@example.com',
    avatar: '🧑‍🏫',
    answers: 25,
    questions: 2,
    badges: ['Community Helper', 'Elite Advisor'],
  },
  {
    id: 2,
    name: 'Senior_A',
    email: 'senior.a@example.com',
    avatar: '🧑‍🎓',
    answers: 18,
    questions: 4,
    badges: ['Helpful Hero', 'Top Contributor'],
  },
  {
    id: 3,
    name: 'Junior_B',
    email: 'junior.b@example.com',
    avatar: '👩‍🎓',
    answers: 15,
    questions: 5,
    badges: ['First Responder'],
  },
];

function LeaderBoard() {

  const sortedData = [...mockLeaderboardData].sort((a, b) => b.answers - a.answers);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-4 py-28">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">🏆 Top Contributors</h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedData.map((user, index) => (
            <LeaderCard user={user} index={index} key={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default LeaderBoard;
