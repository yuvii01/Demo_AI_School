import React from 'react';
import styled from 'styled-components';

const SubjectBoxesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  justify-content: center;
  margin: 18px 0;
`;

const SubjectBox = styled.div`
  background: #f8fafc;
  border: 1.5px solid #1976d2;
  border-radius: 10px;
  padding: 18px 28px;
  min-width: 120px;
  min-height: 40px;
  font-size: 1.08rem;
  font-weight: 600;
  color: #1976d2;
  text-align: center;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.07);

  &:hover {
    background: #e3f0ff;
    color: #174ea6;
    box-shadow: 0 4px 16px rgba(25, 118, 210, 0.13);
  }
`;

const jeeSubjects = ["Physics", "Chemistry", "Maths"];

const SubjectsJEE = ({ onSelectSubject }) => (
  <SubjectBoxesWrapper>
    {jeeSubjects.map((subject) => (
      <SubjectBox
        key={subject}
        onClick={() => onSelectSubject(subject)}
      >
        {subject}
      </SubjectBox>
    ))}
  </SubjectBoxesWrapper>
);

export default SubjectsJEE;