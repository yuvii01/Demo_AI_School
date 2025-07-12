import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import Main from '../Main/Main';
// import Paper from '../paper/Paper';
// import Quiz from '../quiz/Quiz';
// import Revision from '../revision/Revision';
// import CurrentAffairs from '../upsc/CurrentAffairs';
import DoubtsJEE from './DoubtsJEE';
import PaperJEE from './PaperJEE';
import QuizJEE from './QuizJEE';
import RevisionJEE from './RevisionJEE';
import { useNavigate } from 'react-router-dom';

// Styled Components
// ...existing code...
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%);
  padding: 0 12px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1976d2;
  letter-spacing: 1px;
  text-align: center;
`;

const BoxGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-bottom: 24px;
  justify-content: center;

  @media (max-width: 900px) {
    gap: 20px;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
    width: 100%;
    align-items: center;
  }
`;

const ActionBox = styled.button`
  width: 200px;
  height: 120px;
  background: #fff;
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.10);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1976d2;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  position: relative;
  white-space: nowrap;
  &:hover {
    background: #e3f0ff;
    transform: translateY(-4px) scale(1.04);
  }
  @media (max-width: 600px) {
    width: 95vw;
    min-width: 0;
    height: 80px;
    font-size: 1rem;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  padding: 10px 24px 10px 24px;
  min-width: 340px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 500px) {
    min-width: 95vw;
    padding: 18px 4vw 12px 4vw;
    min-height: 60vw;
    max-height: 95vh;
    overflow-y: auto;
  }
`;


const CloseBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 1.4rem;
  color: #888;
  cursor: pointer;
  align-self: flex-end;
  margin-bottom: 8px;
  transition: color 0.2s;

  &:hover {
    color: #1976d2;
  }
`;

const DivisionJEE = ({examType}) => {
  const [showDoubts, setShowDoubts] = useState(false);
  const [showPaper, setShowPaper] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    if (!courses.includes('jee')) {
      navigate('/home') ;
    }
  }, [navigate]);

   const openOnly = (setter) => {
    setShowDoubts(false);
    setShowPaper(false);
    setShowQuiz(false);
    setShowPlanner(false);
    setter(true);
  };

  return (
    <Container>
      <Title>{examType ? `${examType} - ` : ''}
        What would you like to do?</Title>
      <BoxGrid>
        <ActionBox onClick={() => openOnly(setShowPaper)}>
          📝<div style={{marginTop: 8}}>Paper Generator</div>
        </ActionBox>
        <ActionBox onClick={() => openOnly(setShowDoubts)}>
          ❓<div style={{marginTop: 8}}>Doubts</div>
        </ActionBox>
        <ActionBox onClick={() => openOnly(setShowQuiz)}>
          🧠{examType === "UPSC" ? "Current Affairs Booster" : "Smart Quiz Generator"}
        </ActionBox>
        <ActionBox onClick={() => openOnly(setShowPlanner)}>
          📅<div style={{marginTop: 8}}>Revision Planner</div>
        </ActionBox>
      </BoxGrid>
      {showDoubts && (
        <>
          {navigate('/demo/doubts')}
        </>
      )}
      {showPaper && (
        <>
          {navigate('/demo/paper')}
        </>
      )}
      {showQuiz && (
        <>
          {navigate('/demo/quiz')}
        </>
      )}
      {showPlanner && (
        <>
          {navigate('/demo/revision')}
        </>
      )}
    </Container>
  );
};

export default DivisionJEE;