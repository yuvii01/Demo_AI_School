import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsPDF from 'jspdf';
import { FaDownload } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

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
    padding: 12px 0 8px 0;
  }
`;

const PaperCard = styled.div`
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
    max-width: 90vw;
    padding: 28px 10vw 24px 10vw;
  }
  @media (max-width: 600px) {
    max-width: 98vw;
    padding: 14px 2vw 14px 2vw;
    margin-bottom: 18px;
    border-radius: 12px;
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
    font-size: 1.3rem;
    margin-bottom: 18px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media (max-width: 600px) {
    gap: 14px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;

  @media (max-width: 600px) {
    gap: 4px;
  }
`;

const Label = styled.label`
  font-weight: 700;
  color: #174ea6;
  font-size: 1rem;

  @media (max-width: 600px) {
    font-size: 0.97rem;
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

const Button = styled.button`
  margin-top: 10px;
  background: linear-gradient(90deg, #1976d2 60%, #43a047 100%);
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 14px 0;
  font-size: 1.18rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
  &:hover {
    background: linear-gradient(90deg, #1565c0 60%, #388e3c 100%);
    transform: scale(1.03);
  }

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 10px 0;
    border-radius: 7px;
  }
`;

const BlueprintWrapper = styled.div`
  width: 100%;
  max-width: 540px;
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(25, 118, 210, 0.10), 0 1px 4px rgba(0,0,0,0.04);
  margin-top: 18px;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 220px;
  animation: ${fadeIn} 0.7s;
  border: 1.5px solid #e3eafc;

  @media (max-width: 900px) {
    max-width: 90vw;
  }
  @media (max-width: 600px) {
    max-width: 98vw;
    border-radius: 10px;
  }
`;

const BlueprintTitle = styled.div`
  font-size: 1.18rem;
  font-weight: 800;
  color: #1976d2;
  background: #e3f0ff;
  border-radius: 18px 18px 0 0;
  padding: 18px 22px 12px 22px;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 12px 10px 8px 10px;
    border-radius: 10px 10px 0 0;
  }
`;

const ScrollableBlueprint = styled.div`
  max-height: 340px;
  overflow-y: auto;
  background: #fff;
  border-radius: 0 0 0 0;
  padding: 22px 18px 18px 18px;
  font-size: 1.07rem;
  color: #222;
  box-shadow: none;
  margin-bottom: 0;
  white-space: pre-wrap;
  border-bottom: 1px solid #e3eafc;

  @media (max-width: 600px) {
    font-size: 0.97rem;
    padding: 12px 8px 10px 8px;
    max-height: 220px;
  }
`;

const LoadingBar = styled.div`
  width: 100%;
  height: 7px;
  background: #e3eafc;
  border-radius: 4px;
  margin: 18px 0 10px 0;
  overflow: hidden;
  position: relative;

  @media (max-width: 600px) {
    margin: 10px 0 6px 0;
    height: 5px;
  }
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #1976d2 60%, #43a047 100%);
  width: ${({ stage }) => (stage === 1 ? '33%' : stage === 2 ? '66%' : stage === 3 ? '100%' : '0%')};
  transition: width 0.7s;
`;

const Loading = styled.div`
  color: #1976d2;
  font-weight: 700;
  font-size: 1.13rem;
  text-align: center;
  min-height: 32px;
  margin-top: 12px;

  @media (max-width: 600px) {
    font-size: 1rem;
    min-height: 24px;
    margin-top: 6px;
  }
`;

const DownloadBtn = styled.button`
  background: #43a047;
  color: #fff;
  border: none;
  border-radius: 0 0 18px 18px;
  padding: 15px 0;
  font-size: 1.13rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(67, 160, 71, 0.08);
  &:hover {
    background: #2e7031;
  }
  position: sticky;
  bottom: 0;

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 10px 0;
    border-radius: 0 0 10px 10px;
  }
`;

// ...existing classOptions and subjectsByClass...

const classOptions = Array.from({ length: 12 }, (_, i) => ({
  value: `class ${i + 1}`,
  label: `Class ${i + 1}`,
}));

const subjectsByClass = {
  "class 1": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "evs", label: "EVS" },
  ],
  "class 2": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "evs", label: "EVS" },
  ],
  "class 3": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "evs", label: "EVS" },
  ],
  "class 4": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "science", label: "Science" },
    { value: "social science", label: "Social Science" },
  ],
  "class 5": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "science", label: "Science" },
    { value: "social science", label: "Social Science" },
  ],
  "class 6": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "science", label: "Science" },
    { value: "social science", label: "Social Science" },
    { value: "hindi", label: "Hindi" },
  ],
  "class 7": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "science", label: "Science" },
    { value: "social science", label: "Social Science" },
    { value: "hindi", label: "Hindi" },
  ],
  "class 8": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "science", label: "Science" },
    { value: "social science", label: "Social Science" },
    { value: "hindi", label: "Hindi" },
  ],
  "class 9": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "science", label: "Science" },
    { value: "social science", label: "Social Science" },
    { value: "hindi", label: "Hindi" },
  ],
  "class 10": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "science", label: "Science" },
    { value: "social science", label: "Social Science" },
    { value: "hindi", label: "Hindi" },
  ],
  "class 11": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "computer science", label: "Computer Science" },
    { value: "hindi", label: "Hindi" },
  ],
  "class 12": [
    { value: "english", label: "English" },
    { value: "maths", label: "Maths" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "computer science", label: "Computer Science" },
    { value: "hindi", label: "Hindi" },
  ],
};

const PaperJEE = () => {
  const [selectedClass, setSelectedClass] = useState('class 10');
  const [subject, setSubject] = useState(subjectsByClass['class 10'][0].value);
  const [numQuestions, setNumQuestions] = useState(5);
  const [customLoading, setCustomLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const resultRef = useRef();
  const navigate = useNavigate();
  const processResponse1 = (response) => {
    setResultData(response);
  };

  const onSent5 = async (selectedClass, sub, num) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response = await run5(selectedClass, sub, num);
    processResponse1(response);
    setLoading(false);
  };

  async function run5(selectedClass, sub, num) {
    const papergene = `
  Generate an exam paper for ${selectedClass.replace('class', 'Class')} in the subject of ${sub}. The paper should begin with a heading that clearly displays the class and subject names. Below the heading, list exactly ${num} unique and relevant questions that test a range of concepts and difficulty levels appropriate for this subject. Each question should be clearly numbered and separated by one blank line for readability. Do not include answers or additional instructions—just the heading and the questions.
  Do NOT use LaTeX formatting or special symbols like $, \\frac, \\int, or superscripts/subscripts.

Instead, use plain text math notation. For example:

Write x^2 for "x squared"

Write sqrt(x) for square root

Write integral from 0 to x of 1 / (1 + t^4) dt instead of LaTeX expressions

This ensures compatibility with plain text and PDF formats."
`;

    const apiKey = process.env.REACT_APP_GEMINI_API1;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      responseMimeType: "text/plain",
    };

    const fullPrompt = papergene;

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    const result = await chatSession.sendMessage(fullPrompt);
    return result.response.text();
  }

  // Custom loading sequence
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowResult(false);
    setCustomLoading(true);
    setLoadingStage(1);

    setTimeout(() => setLoadingStage(2), 6000); // After 6s
    setTimeout(() => setLoadingStage(3), 11000); // After 11s
    setTimeout(() => {
      setCustomLoading(false);
      setShowResult(true);
      onSent5(selectedClass, subject, numQuestions);
    }, 16000); // After 16s
  };

  // Loading message logic
  let loadingMessage = '';
  if (customLoading) {
    if (loadingStage === 1) loadingMessage = 'Thinking...';
    else if (loadingStage === 2) loadingMessage = 'Generating question paper...';
    else if (loadingStage === 3) loadingMessage = 'Finalising...';
  }

  // Improved PDF download: fit content to A4, avoid cut-off
  const handleDownloadPDF = () => {
    if (!resultData) return;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });
    const margin = 40;
    const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    let y = margin;

    // Add heading
    pdf.setFontSize(16);
    pdf.text(
      `${selectedClass.replace('class', 'Class').toUpperCase()} - ${subject.toUpperCase()} (${numQuestions} Questions)`,
      margin,
      y
    );
    y += 30;

    // Split resultData into lines
    const lines = resultData.split('\n');
    pdf.setFontSize(12);
    lines.forEach((line) => {
      const split = pdf.splitTextToSize(line, pageWidth);
      split.forEach((txt) => {
        if (y > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(txt, margin, y);
        y += 20;
      });
      y += 5;
    });

    pdf.save(`${selectedClass}_${subject}_paper.pdf`);
  };

  return (
    <PageWrapper>
      <PaperCard>
        <Title>Class Paper Generator <span  style={{
    float: 'right',
    cursor: 'pointer',
    fontSize: '1.3em',
    marginLeft: 'auto',
    marginRight: 0,
    lineHeight: 1,
    userSelect: 'none'
  }} onClick={() => {navigate('/demo')}}>❌</span> </Title>
        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="class">Class:</Label>
            <Select
              id="class"
              value={selectedClass}
              onChange={e => {
                setSelectedClass(e.target.value);
                setSubject(subjectsByClass[e.target.value][0].value);
              }}
            >
              {classOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="subject">Subject:</Label>
            <Select
              id="subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            >
              {subjectsByClass[selectedClass].map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="numQuestions">Number of Questions:</Label>
            <Select
              id="numQuestions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </Select>
          </Field>
          <Button type="submit" disabled={customLoading}>
            Generate Paper
          </Button>
        </Form>
      </PaperCard>

      {(customLoading || showResult) && (
        <BlueprintWrapper>
          <BlueprintTitle>Paper Blueprint</BlueprintTitle>
          {customLoading && (
            <LoadingBar>
              <Progress stage={loadingStage} />
            </LoadingBar>
          )}
          <ScrollableBlueprint ref={resultRef}>
            {customLoading ? (
              <Loading>{loadingMessage}</Loading>
            ) : showResult && loading ? (
              <Loading>Thinking...</Loading>
            ) : showResult && resultData ? (
              resultData
            ) : null}
          </ScrollableBlueprint>
          {showResult && resultData && !loading && (
            <DownloadBtn onClick={handleDownloadPDF}>
              <FaDownload /> Download PDF
            </DownloadBtn>
          )}
        </BlueprintWrapper>
      )}
    </PageWrapper>
  )
};
export default PaperJEE;