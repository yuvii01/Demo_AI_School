import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import jsPDF from 'jspdf';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

const Result = styled.div`
  margin-top: 18px;
  background: #f8fafc;
  border-radius: 10px;
  padding: 24px 20px;
  min-height: 108px;
  font-size: 1.07rem;
  color: #333;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  word-break: break-word;
  overflow-wrap: break-word;
  max-height: 400px;
  overflow-y: auto;

  @media (max-width: 600px) {
    font-size: 0.97rem;
    padding: 14px 8px;
    min-height: 40px;
    max-height: 160px;
  }
`;

const Loading = styled.div`
  color: #1976d2;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  min-height: 32px;

  @media (max-width: 600px) {
    font-size: 1rem;
    min-height: 24px;
  }
`;

const DownloadBtn = styled.button`
  margin-top: 16px;
  background: #43a047;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 14px 0;
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

const RevisionJEE = () => {
  const [selectedClass, setSelectedClass] = useState('class 11');
  const [subject, setSubject] = useState(subjectsByClass['class 11'][0].value);
  const [topic, setTopic] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, setPreviousPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Update subject options when class changes
  const handleClassChange = (e) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    setSubject(subjectsByClass[newClass][0].value);
  };

  const processResponse1 = (response) => {
    setResultData(response);
  };
  const onSent7 = async (selectedClass, sub, topic) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response = await run7(selectedClass, sub, topic);
    processResponse1(response);
    setLoading(false);
    setInput("");
  };
  async function run7(selectedClass, sub, topic) {
    const papergene = `
Generate the best possible, chapter-wise detailed revision notes for ${selectedClass.replace('class', 'Class')} in the subject of ${sub}${topic ? `, specifically focusing on the topic: ${topic}` : ''}. 
Begin with a clear heading that displays the class and subject${topic ? ` and topic` : ''} names. 
Organize the notes chapter-wise, with each chapter or major concept as a separate section. 
Within each chapter, comprehensively cover all key concepts, formulas, important facts, and include concise explanations, diagrams (if relevant), and tips for quick revision. 
Use bullet points, subheadings, and clear sections for maximum readability. 
Ensure the content is accurate, up-to-date, and suitable for last-minute revision for high performance in the exam. 
Do not include questions, answers , —just the chapter-wise revision notes.
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
      onSent7(selectedClass, subject, topic);
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
      `${selectedClass.replace('class', 'Class').toUpperCase()}${subject ? ` - Subject: ${subject}` : ''}${topic ? ` - Topic: ${topic}` : ''}`,
      margin,
      y
    );
    y += 30;

    // Parse HTML and extract lines as plain text
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

    pdf.save(`${selectedClass}_revision_plan.pdf`);
  };

  let loadingMessage = '';
  if (customLoading) {
    if (loadingStage === 1) loadingMessage = 'Thinking...';
    else if (loadingStage === 2) loadingMessage = 'Generating revision plan...';
    else if (loadingStage === 3) loadingMessage = 'Finalising...';
  }

  return (
    <PageWrapper>
      <Card>
        <Title>Revision Planner</Title>
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
            <Label htmlFor="topic">Topic (optional):</Label>
            <Input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic if any"
            />
          </Field>
          <Button type="submit" disabled={customLoading || loading}>
            Generate Revision Plan
          </Button>
        </Form>
        <Result>
          {customLoading ? (
            <Loading>{loadingMessage}</Loading>
          ) : showResult && loading ? (
            <Loading>Thinking...</Loading>
          ) : showResult && resultData ? (
            <>
              <div style={{ marginBottom: 12, color: "#1976d2", fontWeight: 600 }}>
                Revision plan generated! You can now download the PDF.
              </div>
              <div style={{ whiteSpace: "pre-wrap", color: "#222", fontWeight: 400, fontSize: "1rem" }}>
                {resultData}
              </div>
              <DownloadBtn onClick={handleDownloadPDF} style={{ marginTop: 18 }}>
                Download PDF
              </DownloadBtn>
            </>
          ) : null}
        </Result>
      </Card>
      {/* Blueprint/Preview below */}
      {/* {showResult && resultData && (
        <BlueprintWrapper>
          <BlueprintTitle>Revision Plan Blueprint</BlueprintTitle>
          <ScrollableBlueprint>
            {resultData}
          </ScrollableBlueprint>
        </BlueprintWrapper>
      )} */}
    </PageWrapper>
  );
};

export default RevisionJEE;