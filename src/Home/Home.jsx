import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
`;

const DemoBox = styled.button`
  width: 500px;
  height: 300px;
  background: linear-gradient(120deg, #fff 60%, #e3f0ff 100%);
  border: none;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.15), 0 2px 8px rgba(0,0,0,0.06);
  font-size: 2.5rem;
  font-weight: 900;
  color: #1976d2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 2px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 12px 40px rgba(25, 118, 210, 0.22);
  }

  @media (max-width: 600px) {
    width: 95vw;
    max-width: 340px;
    height: 180px;
    font-size: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: #174ea6;
  text-align: center;
  letter-spacing: 2px;
  margin-bottom: 40px;
`;

const Home = () => {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    navigate('/demo');
  };

  return (
    <Container>
      <Title>Demo Template</Title>
      <DemoBox onClick={handleDemoClick}>
        Demo
      </DemoBox>
    </Container>
  );
};

export default Home;