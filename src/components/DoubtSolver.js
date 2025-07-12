import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import jsPDF from 'jspdf';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Responsive Styled Components (like Paper Generator) ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const SubjectBadge = styled.span`
  display: inline-block;
  background: #e3f0ff;
  color: #1976d2;
  font-weight: 700;
  border-radius: 10px;
  padding: 8px 20px;
  font-size: 1.15rem;
  margin-bottom: 10px;
  text-transform: capitalize;
`;

const Title = styled.h2`
  color: #174ea6;
  font-size: 2.2rem;
  font-weight: 900;
  margin: 0 0 10px 0;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 8px;
  }
`;

const Subtitle = styled.p`
  color: #555;
  font-size: 1.13rem;
  margin: 0;
  margin-bottom: 8px;

  @media (max-width: 600px) {
    font-size: 0.97rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 18px;

  @media (max-width: 600px) {
    gap: 10px;
    margin-bottom: 10px;
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
  background: #fff;
  border-radius: 10px;
  padding: 24px 20px;
  min-height: 80px;
  font-size: 1.15rem;
  color: #333;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  word-break: break-word;
  overflow-wrap: break-word;
  max-height: 260px;
  overflow-y: auto;
  margin-top: 18px;

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 14px 8px;
    min-height: 60px;
    max-height: 160px;
  }
`;

const LoaderAnim = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const Loader = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1976d2;
  animation: ${LoaderAnim} 1s infinite;
`;

const LoadingText = styled.div`
  color: #1976d2;
  font-weight: 600;
  text-align: center;
  font-size: 1.13rem;
  margin-top: 10px;

  @media (max-width: 600px) {
    font-size: 1rem;
    margin-top: 6px;
  }
`;

const DoubtSolver = ({ subject, examType }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, setPreviousPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [showResult, setShowResult] = useState(false);

  // Use both subject and examType in the system prompt
  const systemPrompt = `You are an expert in ${subject} . Please provide detailed explanations and solutions to the user's doubts.`;

  async function run(prompt) {
    const apiKey = process.env.REACT_APP_GEMINI_API4;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      responseMimeType: "text/plain",
    };
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

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

  // Reset input/result when subject or examType changes
  useEffect(() => {
    setInput('');
    setResultData('');
  }, [subject, examType]);

  const processResponse = (response) => {
    setResultData(""); // Clear previous result
    let responseArray = response.split("**");
    let newResponse = "" ;
    for (let i = 0; i < responseArray.length; i++) {
      newResponse += (i === 0 || i % 2 !== 1) ? responseArray[i] : "<b>" + responseArray[i] + "</b>";
    }

    let newResponse2 = newResponse.split('*').join('<br>');
    // Split by space to animate word by word
    let newResponseArray = newResponse2.split(' ');

    // Animate word by word with proper gap
    let liveResult = "";
    newResponseArray.forEach((word, i) => {
      setTimeout(() => {
        liveResult += word + " ";
        setResultData(liveResult);
      }, 60 * i); // Adjust speed here (ms per word)
    });
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (prompt !== undefined ) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    }
    else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run(input);
    }

    processResponse(response);
    setLoading(false);
    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSent(input);
  };

  return (
    <Card>
      <Header>
        <SubjectBadge>
          {subject} 
        </SubjectBadge>
        <Title>{subject} Doubt Solver</Title>
        <Subtitle>
          Ask any question related to {subject}  and get instant help!
        </Subtitle>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="doubt">Your Doubt:</Label>
          <Input
            id="doubt"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type your doubt in ${subject}...`}
            autoFocus
          />
        </Field>
        <Button type="submit" disabled={loading || !input.trim()}>
          {loading ? <Loader /> : "Submit"}
        </Button>
      </Form>
      <Result>
        {loading ? (
          <LoadingText>Thinking...</LoadingText>
        ) : (
          resultData && <p dangerouslySetInnerHTML={{ __html: resultData }} />
        )}
      </Result>
    </Card>
  );
};

export default DoubtSolver;