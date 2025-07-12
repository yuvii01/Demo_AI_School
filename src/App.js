import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import DivisionJEE from './components/jee/DivisionJEE';


import PaperJEE from './components/jee/PaperJEE';
import QuizJEE from './components/jee/QuizJEE';
import DoubtsJEE from './components/jee/DoubtsJEE';
import RevisionJEE from './components/jee/RevisionJEE';
import Home from './Home/Home';

import Login from './components/Login';

const App = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (window.location.pathname === '/' && token) {
      navigate('/home');
    }
  }, [navigate]);

  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/demo" element={<DivisionJEE />} />
        <Route path="/demo/paper" element={<PaperJEE />} />
        <Route path="/demo/quiz" element={<QuizJEE />} />
        <Route path="/demo/doubts" element={<DoubtsJEE />} />
        <Route path="/demo/revision" element={<RevisionJEE />} />

      </Routes>
  );
};

export default App;