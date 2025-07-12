import React from 'react';
import styled from 'styled-components';

// Responsive wrapper and box styles
const SubjectBoxesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  justify-content: center;
  margin: 18px 0;

  @media (max-width: 600px) {
    gap: 10px;
    margin: 10px 0;
  }
`;

const SubjectBox = styled.div`
  background: #f8fafc;
  border: 1.5px solid #1976d2;
  border-radius: 12px;
  padding: 18px 28px;
  min-width: 110px;
  min-height: 40px;
  font-size: 1.08rem;
  font-weight: 700;
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

  @media (max-width: 900px) {
    padding: 14px 18px;
    min-width: 90px;
    font-size: 1rem;
  }
  @media (max-width: 600px) {
    padding: 10px 10px;
    min-width: 70px;
    font-size: 0.97rem;
    border-radius: 8px;
  }
`;

// Subjects by class
const subjectsByClass = {
  "class 1": ["English", "Maths", "EVS"],
  "class 2": ["English", "Maths", "EVS"],
  "class 3": ["English", "Maths", "EVS"],
  "class 4": ["English", "Maths", "Science", "Social Science"],
  "class 5": ["English", "Maths", "Science", "Social Science"],
  "class 6": ["English", "Maths", "Science", "Social Science", "Hindi"],
  "class 7": ["English", "Maths", "Science", "Social Science", "Hindi"],
  "class 8": ["English", "Maths", "Science", "Social Science", "Hindi"],
  "class 9": ["English", "Maths", "Science", "Social Science", "Hindi"],
  "class 10": ["English", "Maths", "Science", "Social Science", "Hindi"],
  "class 11": [
    "English", "Maths", "Physics", "Chemistry", "Biology", "Computer Science", "Hindi"
  ],
  "class 12": [
    "English", "Maths", "Physics", "Chemistry", "Biology", "Computer Science", "Hindi"
  ],
};

const classOptions = Array.from({ length: 12 }, (_, i) => ({
  value: `class ${i + 1}`,
  label: `Class ${i + 1}`,
}));

const ClassSelectWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 18px;

  @media (max-width: 600px) {
    margin-bottom: 10px;
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border-radius: 9px;
  border: 1.5px solid #bdbdbd;
  font-size: 1.05rem;
  background: #f8fafc;
  transition: border 0.2s;
  &:focus {
    border-color: #1976d2;
  }

  @media (max-width: 600px) {
    font-size: 0.97rem;
    padding: 8px 10px;
    border-radius: 7px;
  }
`;

const SubjectsJEE = ({ onSelectSubject , onSelectClass }) => {
  const [selectedClass, setSelectedClass] = React.useState('class 10');

  const subjects = subjectsByClass[selectedClass];

  return (
    <>
      <ClassSelectWrapper>
        <Select
          value={selectedClass}
          onChange={e => {
            setSelectedClass(e.target.value);
            onSelectClass(e.target.value);
          }}
        >
          {classOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
      </ClassSelectWrapper>
      <SubjectBoxesWrapper>
        {subjects.map(subject => (
          <SubjectBox
            key={subject}
            onClick={() => onSelectSubject(subject)}
          >
            {subject}
          </SubjectBox>
        ))}
      </SubjectBoxesWrapper>
    </>
  );
};

export default SubjectsJEE;