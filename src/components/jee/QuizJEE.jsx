import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Container = styled.div`
  max-width: 500px;
  margin: 30px auto;
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.10);
  padding: 16px 18px 16px 18px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 0;
  max-height: 80vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid #bdbdbd;
  font-size: 1rem;
  background: #fff;
  transition: border 0.2s;
  &:focus {
    border-color: #1976d2;
  }
`;

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid #bdbdbd;
  font-size: 1rem;
  background: #fff;
  transition: border 0.2s;
  &:focus {
    border-color: #1976d2;
  }
`;

const Button = styled.button`
  margin-top: 10px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1565c0;
  }
`;

const Result = styled.div`
  margin-top: 18px;
  background: #fff;
  border-radius: 8px;
  padding: 16px 14px;
  min-height: 48px;
  font-size: 1rem;
  color: #333;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  word-break: break-word;
  overflow-wrap: break-word;
`;

const Loading = styled.div`
  color: #1976d2;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  min-height: 32px;
`;

const DownloadBtn = styled.button`
  margin-top: 16px;
  background: #43a047;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  &:hover {
    background: #2e7031;
  }
`;

const QuizJEE = () => {
  // Only JEE options
  const [paperType, setPaperType] = useState('jeemains');
  const [subject, setSubject] = useState('physics');
  const [difficulty, setDifficulty] = useState('easy');
  const [topics, setTopics] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);



  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, setPreviousPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const processResponse1 = (response) => {
    setResultData(response);
  };
  const onSent6 = async (exam, sub, topic, difficulty, numQues) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (exam !== undefined) {
      response = await run6(exam, sub, topic, difficulty, numQues);
      setRecentPrompt(exam + " " + sub + " " + topic + " " + difficulty);
    } else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run6(input);
    }

    processResponse1(response);
    setLoading(false);
    setInput("");
  };
  async function run6(exam, sub, topic, difficulty, numquestions) {
      const papergene = `
  "Generate a well-structured, in-syllabus multiple-choice quiz for the ${exam} in the subject of ${sub}${topic ? `, specifically focusing on the topic : **${topic}**` : ''}.
  The quiz must contain exactly ${numquestions} multiple-choice questions (MCQs), adhering strictly to the latest syllabus and question pattern of the exam.
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
  "${exam} – ${sub}${topic ? ` Topic: ${topic}` : ''}"
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
    


  const paperOptions = [
    { value: "jeemains", label: "JEE Mains" },
    { value: "jeeadvanced", label: "JEE Advanced" },
  ];

  const subjectOptions = [
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "maths", label: "Maths" },
    { value: "all", label: "All (Physics, Chemistry, Maths)" },
  ];

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
      onSent6(paperType, subject, topics, difficulty, numQuestions);
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
      `${paperType.toUpperCase()} - ${subject.toUpperCase()}${topics ? ` - Topics: ${topics}` : ''} - Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
      margin,
      y
    );
    y += 30;

    // Parse HTML and extract questions as plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = resultData;

    let lines = [];
    tempDiv.querySelectorAll('p, li, div').forEach((el) => {
      const text = el.innerText.trim();
      if (text) lines.push(text);
    });

    if (lines.length === 0) {
      lines = [tempDiv.innerText.trim()];
    }

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

    pdf.save(`${paperType}_${subject}_quiz.pdf`);
  };

  let loadingMessage = '';
  if (customLoading) {
    if (loadingStage === 1) loadingMessage = 'Thinking...';
    else if (loadingStage === 2) loadingMessage = 'Generating quiz...';
    else if (loadingStage === 3) loadingMessage = 'Finalising...';
  }

  return (
    <Container>
      <Title>JEE Quiz Generator</Title>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="paperType">Type of Paper:</Label>
          <Select
            id="paperType"
            value={paperType}
            onChange={(e) => setPaperType(e.target.value)}
          >
            {paperOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="subject">Subject:</Label>
          <Select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="difficulty">Difficulty:</Label>
          <Select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
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
        <Button type="submit">Generate Quiz</Button>
      </Form>
      <Result>
        {customLoading ? (
          <Loading>{loadingMessage}</Loading>
        ) : showResult && loading ? (
          <Loading>Thinking...</Loading>
        ) : showResult && resultData ? (
          <Loading>Quiz generated! You can now download the PDF.</Loading>
        ) : null}
      </Result>
      {showResult && resultData && !loading && (
        <DownloadBtn onClick={handleDownloadPDF}>
          Download PDF
        </DownloadBtn>
      )}
    </Container>
  );
};

export default QuizJEE;