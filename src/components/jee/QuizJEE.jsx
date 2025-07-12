import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import jsPDF from 'jspdf';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaDownload } from "react-icons/fa";

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
    padding: 24px 0 16px 0;
  }
  @media (max-width: 600px) {
    padding: 4vw 0 4vw 0;
    min-height: 100dvh;
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
    max-width: 95vw;
    padding: 24px 4vw 18px 4vw;
  }
  @media (max-width: 600px) {
    max-width: 99vw;
    padding: 12px 2vw 12px 2vw;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media (max-width: 600px) {
    gap: 12px;
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

const Input = styled.input`
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
    max-width: 95vw;
  }
  @media (max-width: 600px) {
    max-width: 99vw;
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

const QuizJEE = () => {
  const [selectedClass, setSelectedClass] = useState('class 11');
  const [subject, setSubject] = useState(subjectsByClass['class 11'][0].value);
  const [difficulty, setDifficulty] = useState('easy');
  const [topics, setTopics] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const resultRef = useRef();

  const processResponse1 = (response) => {
    setResultData(response);
  };

  const onSent6 = async (selectedClass, sub, topic, difficulty, numQues) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response = await run6(selectedClass, sub, topic, difficulty, numQues);
    processResponse1(response);
    setLoading(false);
  };

  async function run6(selectedClass, sub, topic, difficulty, numquestions) {
    const papergene = `
Generate a well-structured, in-syllabus multiple-choice quiz for ${selectedClass.replace('class', 'Class')} in the subject of ${sub}${topic ? `, specifically focusing on the topic : **${topic}**` : ''}.
The quiz must contain exactly ${numquestions} multiple-choice questions (MCQs), adhering strictly to the latest syllabus and question pattern of the class.
Formatting and structure guidelines:
Each question should be clearly numbered.
Present the question text in a new paragraph.
Provide exactly 4 answer choices labeled (A), (B), (C), and (D), each on a separate line.
Leave a blank line between questions for readability.
Indicate the correct answer immediately after each question, using this format: Answer: [Option Letter].
Ensure that each question and its options are concise and do not exceed 5 lines total (to ensure proper formatting in PDF).
Do NOT include:
Explanations, hints, or additional instructions
Any content outside of the formatted quiz
Begin the quiz with a centered heading that clearly shows:
"${selectedClass.replace('class', 'Class')} – ${sub}${topic ? ` Topic: ${topic}` : ''}"
The overall difficulty level should be: ${difficulty || 'easy'}.
Ensure the layout is clean, minimal, and optimized for PDF export.
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResult(false);
    setCustomLoading(true);
    setLoadingStage(1);

    setTimeout(() => setLoadingStage(2), 6000);
    setTimeout(() => setLoadingStage(3), 11000);
    setTimeout(() => {
      setCustomLoading(false);
      setShowResult(true);
      onSent6(selectedClass, subject, topics, difficulty, numQuestions);
    }, 16000);
  };

  // PDF download logic
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
      `${selectedClass.replace('class', 'Class').toUpperCase()} - ${subject.toUpperCase()}${topics ? ` - Topics: ${topics}` : ''} - Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
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

    pdf.save(`${selectedClass}_${subject}_quiz.pdf`);
  };

  let loadingMessage = '';
  if (customLoading) {
    if (loadingStage === 1) loadingMessage = 'Thinking...';
    else if (loadingStage === 2) loadingMessage = 'Generating quiz...';
    else if (loadingStage === 3) loadingMessage = 'Finalising...';
  }

  // Update subject options when class changes
  const handleClassChange = (e) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    setSubject(subjectsByClass[newClass][0].value);
  };

  return (
    <PageWrapper>
      <PaperCard>
        <Title>Quiz Generator</Title>
        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="class">Class:</Label>
            <Select
              id="class"
              value={selectedClass}
              onChange={handleClassChange}
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
            <Label htmlFor="difficulty">Difficulty:</Label>
            <Select
              id="difficulty"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
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
          <Field>
            <Label htmlFor="topics">Topics (optional):</Label>
            <Input
              id="topics"
              type="text"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Enter topics separated by commas"
            />
          </Field>
          <button as={DownloadBtn} style={{ display: 'none' }} />
          <Button type="submit" disabled={customLoading}>
            Generate Quiz
          </Button>
        </Form>
      </PaperCard>

      {(customLoading || showResult) && (
        <BlueprintWrapper>
          <BlueprintTitle>Quiz</BlueprintTitle>
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
  );
};

export default QuizJEE;