
import React, { useContext, useEffect } from 'react';
import { Context } from '../context/context';
import styled, { keyframes } from 'styled-components';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Card = styled.div`
  background: #f8fafc;
  border-radius: 20px; /* Slightly increased border-radius */
  box-shadow: 0 8px 40px rgba(0,0,0,0.12); /* Enhanced shadow for depth */
  padding: 12px 32px 36px 32px; /* Further increased padding */
  max-width: 1000px; /* Further increased max-width */
  margin: 0 auto;
  max-height: 500px; 
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px; /* Further increased margin */
`;

const SubjectBadge = styled.span`
  display: inline-block;
  background: #e3f0ff;
  color: #1976d2;
  font-weight: 700;
  border-radius: 10px; /* Slightly increased border-radius */
  padding: 8px 20px; /* Further increased padding */
  font-size: 1.25rem; /* Further increased font size */
  margin-bottom: 12px; /* Further increased margin */
  text-transform: capitalize;
`;

const Title = styled.h2`
  color: #174ea6;
  font-size: 1.75rem; /* Further increased font size */
  font-weight: 800;
  margin: 0 0 10px 0; /* Adjusted margin */
`;

const Subtitle = styled.p`
  color: #555;
  font-size: 1.25rem; /* Further increased font size */
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  gap: 16px; /* Further increased gap */
  margin-bottom: 32px; /* Further increased margin */
`;

const Input = styled.input`
  flex: 1;
  padding: 16px 20px; /* Further increased padding */
  border-radius: 10px; /* Slightly increased border-radius */
  border: 2px solid #bdbdbd; /* Slightly thicker border */
  font-size: 1.25rem; /* Further increased font size */
  background: #fff;
  transition: border 0.2s;
  &:focus {
    border-color: #1976d2;
  }
`;

const Button = styled.button`
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 10px; /* Slightly increased border-radius */
  padding: 0 32px; /* Further increased padding */
  font-size: 1.3rem; /* Further increased font size */
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  min-width: 120px; /* Further increased min-width */
  &:hover:enabled {
    background: #1565c0;
  }
  &:disabled {
    background: #bdbdbd;
    cursor: not-allowed;
  }
`;

const Result = styled.div`
  background: #fff;
  border-radius: 10px; /* Slightly increased border-radius */
  padding: 24px 20px; /* Further increased padding */
  min-height: 80px; /* Further increased min-height */
  font-size: 1.25rem; /* Further increased font size */
  color: #333;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05); /* Slightly enhanced shadow */
  word-break: break-word;
  overflow-wrap: break-word;
  max-height: 260px; /* Further increased max-height */
  overflow-y: auto;
`;

const LoaderAnim = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const Loader = styled.span`
  display: inline-block;
  width: 24px; /* Further increased size */
  height: 24px; /* Further increased size */
  border-radius: 50%;
  background: #1976d2;
  animation: ${LoaderAnim} 1s infinite;
`;

const LoadingText = styled.div`
  color: #1976d2;
  font-weight: 600;
  text-align: center;
  font-size: 1.3rem; /* Further increased font size */
`;

const DoubtSolver = ({ subject, examType }) => {


  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, setPreviousPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [showResult, setShowResult] = useState(false);

            
   const processResponse = (response) => {
    setResultData(""); // Clear previous result
    let responseArray = response.split("**");
    let newResponse = "" ;
    for (let i = 0; i < responseArray.length; i++) {
      newResponse += (i === 0 || i % 2 !== 1) ? responseArray[i] : "<b>" + responseArray[i] + "</b>";
    }
    // Replace * with <br> for line breaks
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

  const onSent1 = async (prompt, examType) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (prompt !== undefined && examType === "JEE") {
      response = await run1(prompt);
      setRecentPrompt(prompt);
    }
    else if (prompt !== undefined && examType === "NEET") {
      response = await run11(prompt);
      setRecentPrompt(prompt);
    }
    else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run1(input);
    }

    processResponse(response);
    setLoading(false);
    setInput("");
  };
  const onSent2 = async (prompt, examType) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (prompt !== undefined && examType === "JEE") {
      response = await run2(prompt);
      setRecentPrompt(prompt);
    }
    else if (prompt !== undefined && examType === "NEET") {
      response = await run21(prompt);
      setRecentPrompt(prompt);
    }
    else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run2(input);
    }

    processResponse(response);
    setLoading(false);
    setInput("");
  };
  const onSent3 = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (prompt !== undefined) {
      response = await run3(prompt);
      setRecentPrompt(prompt);
    }
    else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run3(input);
    }

    processResponse(response);
    setLoading(false);
    setInput("");
  };
  const onSent4 = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (prompt !== undefined) {
      response = await run4(prompt);
      setRecentPrompt(prompt);
    }
    else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run4(input);
    }

    processResponse(response);
    setLoading(false);
    setInput("");
  };
  const onSent5 = async (prompt, examType) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (prompt !== undefined ) {
      response = await run5(prompt);
      setRecentPrompt(prompt);
    }
    else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run5(input);
    }

    processResponse(response);
    setLoading(false);
    setInput("");
  };
  const onSent6 = async (prompt, examType) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (prompt !== undefined ) {
      response = await run6(prompt);
      setRecentPrompt(prompt);
    }
    else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run6(input);
    }

    processResponse(response);
    setLoading(false);
    setInput("");
  };
  const onSent7 = async (prompt, examType) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (prompt !== undefined ) {
      response = await run7(prompt);
      setRecentPrompt(prompt);
    }
    else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run7(input);
    }

    processResponse(response);
    setLoading(false);
    setInput("");
  };
  const onSent8 = async (prompt, examType) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (prompt !== undefined ) {
      response = await run8(prompt);
      setRecentPrompt(prompt);
    }
    else {
      setPreviousPrompt(prev => [...prev, input]);
      setRecentPrompt(input);
      response = await run8(input);
    }

    processResponse(response);
    setLoading(false);
    setInput("");
  };

  const UpscSystemPrompt = `
You are an expert UPSC teacher with deep knowledge in all UPSC examination subjects, including General Studies, Current Affairs, and Optional Subjects.

Your role is to solve any doubt or question related to the UPSC exam, specifically for the subject: ${subject}.
- Provide clear, concise, and accurate explanations suitable for UPSC aspirants.
- Avoid using LaTeX or mathematical markup in your answers; use plain text only.
- Structure your response in simple, easy-to-understand language.
- If the question is conceptual, provide relevant examples, facts, or context as needed.
- If the question is factual, cite the most recent and reliable information.
- Always keep the answer focused on the UPSC syllabus and exam requirements. `;



    const systemPrompt = `
You are an expert JEE Advanced Chemistry teacher with deep knowledge in Organic, Inorganic, and Physical Chemistry.
Your role is to solve high-level, complex Chemistry problems typically asked in JEE Advanced.
Provide step-by-step solutions, using clear reasoning, chemical principles, and appropriate reaction mechanisms or formulae.
Use IUPAC names, structural interpretations, and concise but precise scientific language.
You can handle multi-step synthesis, conceptual traps, advanced reaction mechanisms, hybridization theory, thermodynamics, equilibrium, electrochemistry, and coordination compounds.
Include proper chemical structures or notation (e.g., CO₂, CH₃–CH₂–OH, [Fe(CN)₆]³⁻) wherever necessary.
If the question involves multiple possible interpretations or edge-case reasoning, mention all valid possibilities.
Always aim to match or exceed the difficulty and depth of JEE Advanced 2024 Chemistry questions.
`;

  const physicsSystemPrompt = `
You are an expert JEE Advanced Physics teacher with deep expertise in classical mechanics, electromagnetism, optics, modern physics, and thermodynamics.
Your role is to solve highly challenging Physics problems typical of JEE Advanced.
Present step-by-step solutions using core physics principles, formulas, and appropriate diagrams or notations (e.g., F = ma, electric field lines, ray diagrams).
Explain each step with conceptual clarity, and include alternate methods when applicable.
Use SI units consistently and maintain scientific rigor in all derivations.
Handle edge cases, tricky concepts, experimental reasoning, and multi-topic integration (e.g., mechanics + electricity).
Target the level of difficulty and precision expected from top JEE Advanced 2024 Physics problem solvers.
`;

  const systemNEETPrompt = `
You are an expert NEET Chemistry teacher with deep mastery of Organic, Inorganic, and Physical Chemistry as per the NCERT Class 11 and 12 curriculum.
Your role is to solve NEET-level Chemistry problems with precision and clarity, focusing on concept-based understanding, NCERT alignment, and exam-oriented insights.
Provide step-by-step solutions using simple, accurate reasoning, key chemical principles, and appropriate formulae or mechanisms where necessary. Use IUPAC names, structural formulae (e.g., CH₃COOH, NH₄⁺, [Cu(NH₃)₄]²⁺), and clearly highlight exceptions or conceptual traps commonly asked in NEET.
Handle problems across:
Organic Chemistry: reaction mechanisms, named reactions, basic to moderate multistep conversions, isomerism, and functional group analysis.
Inorganic Chemistry: periodic trends, chemical bonding, qualitative analysis, coordination compounds, and NCERT-based factual knowledge.
Physical Chemistry: stoichiometry, atomic structure, chemical equilibrium, thermodynamics, electrochemistry, kinetics, and solutions — all with focus on formula-based problem solving and unit analysis.
Ensure your explanations are NEET-focused:
Aligned with NCERT-based facts and typical NEET traps.
Highlight important keywords or reactions often tested.
Address one correct answer only, following the MCQ format.
When ambiguity or multiple interpretations exist, clarify using NCERT guidelines or established NEET logic.
Always aim to match or exceed the depth and clarity required for a 650+ scorer in NEET Chemistry.
`;

  const physicsNEETSystemPrompt = `
You are an expert NEET Physics teacher with strong command over all topics in the NCERT Class 11 and 12 Physics syllabus, including mechanics, thermodynamics, waves, optics, electricity, magnetism, and modern physics.
Your role is to solve NEET-level Physics problems with clarity and precision, focusing on concept-based learning and exam-oriented strategies.
Provide step-by-step solutions using fundamental physics laws, standard formulas (e.g., v = u + at, F = ma, Snell’s law), and simplified diagrams wherever necessary.
Explain each step with conceptual reasoning suited for NEET aspirants, ensuring alignment with NCERT principles and frequently asked question patterns.
Use SI units consistently and solve numericals with correct unit conversions and significant figures. Highlight key concepts, common traps, and shortcut techniques useful for quick and accurate problem-solving.
Focus on factual accuracy, NCERT-based logic, and single-correct-answer questions as per NEET’s MCQ format.
Your goal is to help students aiming for 650+ scores in NEET by building a strong foundation in Physics with exam-ready explanations and strategy.
`;

  const mathsSystemPrompt = `
You are an expert JEE Advanced Mathematics teacher with mastery in algebra, calculus, coordinate geometry, trigonometry, and probability.
Your role is to solve highly complex math problems at the level of JEE Advanced.
Provide detailed step-by-step solutions with full mathematical justification and derivation.
Include relevant formulas, theorems (e.g., Rolle’s Theorem, Bayes’ Theorem), and graphical insights where needed.
Focus on clarity, brevity, and mathematical precision.
Support multiple solving techniques (analytical, graphical, approximation) if applicable.
Tackle conceptual traps, multi-topic problems, and questions designed to mislead.
Match the depth and rigor expected from JEE Advanced 2024 Mathematics toppers.
`;

  const biologySystemPrompt = `
You are an expert NEET-level Biology teacher with deep knowledge of Botany and Zoology.
Your role is to answer complex biology questions with precision and clarity.
Provide scientifically accurate and structured answers using NCERT-based facts and beyond.
Explain physiological processes, genetic mechanisms, molecular biology pathways, ecological interactions, and plant/animal anatomy.
Use proper scientific terminology (e.g., photosynthesis, DNA replication, acetylcholine, nephron, alveoli).
Clarify conceptual traps and provide illustrations or structured breakdowns when required.
Ensure your explanations support NEET 2024 aspirants aiming for top scores.
`;
  // SSC System Prompt
const SSCSystemPrompt = (subject) => `
You are an expert SSC (Staff Selection Commission) exam teacher with deep knowledge in all SSC examination subjects, including General Awareness, Quantitative Aptitude, Reasoning, and English.

Your role is to solve any doubt or question related to the SSC exam, specifically for the subject: ${subject}.
- Provide clear, concise, and accurate explanations suitable for SSC aspirants.
- Avoid using LaTeX or mathematical markup in your answers; use plain text only.
- Structure your response in simple, easy-to-understand language.
- If the question is conceptual, provide relevant examples, facts, or context as needed.
- If the question is factual, cite the most recent and reliable information.
- Always keep the answer focused on the SSC syllabus and exam requirements.
`;

// Railway System Prompt
const RailwaySystemPrompt = (subject) => `
You are an expert Railway Recruitment exam teacher with deep knowledge in all RRB (Railway Recruitment Board) examination subjects, including General Awareness, Mathematics, Reasoning, and Technical/Trade subjects.

Your role is to solve any doubt or question related to Railway exams, specifically for the subject: ${subject}.
- Provide clear, concise, and accurate explanations suitable for Railway exam aspirants.
- Avoid using LaTeX or mathematical markup in your answers; use plain text only.
- Structure your response in simple, easy-to-understand language.
- If the question is conceptual, provide relevant examples, facts, or context as needed.
- If the question is factual, cite the most recent and reliable information.
- Always keep the answer focused on the Railway exam syllabus and requirements.
`;

// NDA System Prompt
const NdaSystemPrompt = (subject) => `
You are an expert NDA (National Defence Academy) exam teacher with deep knowledge in all NDA examination subjects, including Mathematics, General Ability, English, and Science.

Your role is to solve any doubt or question related to the NDA exam, specifically for the subject: ${subject}.
- Provide clear, concise, and accurate explanations suitable for NDA aspirants.
- Avoid using LaTeX or mathematical markup in your answers; use plain text only.
- Structure your response in simple, easy-to-understand language.
- If the question is conceptual, provide relevant examples, facts, or context as needed.
- If the question is factual, cite the most recent and reliable information.
- Always keep the answer focused on the NDA syllabus and exam requirements.
`;


  async function run1(prompt) {
    const apiKey =process.env.REACT_APP_GEMINI_API4;
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

  async function run11(prompt) {
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
    const fullPrompt = `${systemNEETPrompt}\n\n${prompt}`;

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

  async function run2(prompt) {
    const apiKey = process.env.REACT_APP_GEMINI_API1;
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
    const fullPrompt = `${physicsSystemPrompt}\n\n${prompt}`;

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

  async function run21(prompt) {
    const apiKey = process.env.REACT_APP_GEMINI_API2;
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
    const fullPrompt = `${physicsNEETSystemPrompt}\n\n${prompt}`;

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

  async function run3(prompt) {
    const apiKey = process.env.REACT_APP_GEMINI_API3;
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
    const fullPrompt = `${mathsSystemPrompt}\n\n${prompt}`;

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



  async function run4(prompt) {
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
    const fullPrompt = `${biologySystemPrompt}\n\n${prompt}`;

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

    async function run5(prompt) {
    const apiKey = process.env.REACT_APP_GEMINI_API1;
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
    const fullPrompt = `${UpscSystemPrompt}\n\n${prompt}`;

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

  async function run6(prompt) {
    const apiKey = process.env.REACT_APP_GEMINI_API2;
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
    const fullPrompt = `${SSCSystemPrompt}\n\n${prompt}`;

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
  async function run7(prompt) {
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
    const fullPrompt = `${RailwaySystemPrompt}\n\n${prompt}`;

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

  async function run8(prompt) {
    const apiKey = process.env.REACT_APP_GEMINI_API3;
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
    const fullPrompt = `${NdaSystemPrompt}\n\n${prompt}`;

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

  useEffect(() => {
    setInput('');
    setResultData('');
  }, [subject, setInput, setResultData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subject === "Physics") {
      onSent2(input, examType);
    } else if (subject === "Chemistry") {
      onSent1(input, examType);
    } else if (subject === "Maths") {
      onSent3(input, examType);
    } else if (subject === "Biology") {
      onSent4(input, examType);
    }
    else if(examType === "UPSC"){
      onSent5(input, examType);
    }
    else if(examType === "SSC"){
      onSent6(input, examType);
    }
    else if(examType === "Railway"){
      onSent7(input, examType);
    }
    else if(examType === "NDA"){
      onSent8(input, examType);
    }

  };

  return (
    <Card>
      <Header>
        <SubjectBadge>{subject}</SubjectBadge>
        <Title>{subject} Doubt Solver</Title>
        <Subtitle>Ask any question related to {subject} and get instant help!</Subtitle>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type your doubt in ${subject}...`}
          autoFocus
        />
        <Button type="submit" disabled={loading || !input.trim() }>
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