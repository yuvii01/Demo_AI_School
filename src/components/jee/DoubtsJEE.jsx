import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import DoubtSolver from '../DoubtSolver';
import SubjectsJEE from './SubjectsJEE';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 48px 0 32px 0;

  @media (max-width: 900px) {
    padding: 32px 0 24px 0;
  }
  @media (max-width: 600px) {
    padding: 8vw 0 4vw 0;
    min-height: 100dvh;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 540px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.13), 0 2px 8px rgba(0,0,0,0.06);
  padding: 38px 30px 30px 30px;
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  animation: ${fadeIn} 0.7s;
  border: 1.5px solid #e3eafc;

  @media (max-width: 900px) {
    max-width: 95vw;
    padding: 28px 4vw 24px 4vw;
  }
  @media (max-width: 600px) {
    max-width: 99vw;
    padding: 14px 2vw 14px 2vw;
    margin-bottom: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(25, 118, 210, 0.08);
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  font-weight: 900;
  color: #1976d2;
  margin-bottom: 30px;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 1.25rem;
    margin-bottom: 16px;
    letter-spacing: 0.5px;
  }
`;

const DoubtsJEE = ({ examType }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
  };
  const handleClassSelect = (className) => {
    setSelectedClass(className);
    setSelectedSubject(null); // Reset subject if class changes
  };

  return (
    <PageWrapper>
      <Card>
        <Title>Ask Your Doubt</Title>
        {selectedSubject ? (
          <DoubtSolver subject={selectedSubject} examType={selectedClass} />
        ) : (
          <SubjectsJEE
            examType={examType}
            onSelectClass={handleClassSelect}
            onSelectSubject={handleSubjectSelect}
          />
        )}
      </Card>
    </PageWrapper>
  );
};

export default DoubtsJEE;