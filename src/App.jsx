import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Login from '../src/pages/auth/Login';
import Register from '../src/pages/auth/Register';
import Resetpasword from '../src/pages/auth/Resetpasword';

import AllQuestions from './pages/AllQuestions';
import SingleQuestion from './pages/SingleQuestion';
import AskQuestion from './pages/AskQuestion';
import UserDashboard from './pages/UserDashboard';
import Analytics from './pages/Analytics';
import LeaderBoard from './pages/LeaderBoard';
import AdminDashBord from './pages/AdminDashBord';
import Home from './pages/Home';
import Error from './pages/Error';

// PrivateRoute component to protect routes based on authToken presence
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/reset-password' element={<Resetpasword />} />
      <Route path='/all-questions' element={<AllQuestions />} />
      <Route path="/single-question/:id" element={<SingleQuestion />} />
      <Route path='/' element={<Home />} />
      <Route path='/*' element={<Error />} />

      {/* Protected Routes */}
      <Route
        path='/ask-question'
        element={
          <PrivateRoute>
            <AskQuestion />
          </PrivateRoute>
        }
      />
      <Route
        path='/user-dashboard'
        element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path='/admin-dashBord-in'
        element={
          <PrivateRoute>
            <AdminDashBord />
          </PrivateRoute>
        }
      />

      {/*
      <Route
        path='/analytics'
        element={
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        }
      />
      <Route
        path='/leader-board'
        element={
          <PrivateRoute>
            <LeaderBoard />
          </PrivateRoute>
        }
      />
      */}
    </Routes>
  );
}

export default App;
