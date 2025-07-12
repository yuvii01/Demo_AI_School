// import React, { useState } from 'react';
// import styled from 'styled-components';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Container = styled.div`
//   height: 100vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background: linear-gradient(135deg, #667eea, #764ba2);
// `;

// const Form = styled.form`
//   background: white;
//   padding: 2rem;
//   border-radius: 1rem;
//   width: 400px;
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
// `;

// const Title = styled.h2`
//   text-align: center;
//   color: #333;
// `;

// const Label = styled.label`
//   font-weight: 500;
//   margin-bottom: -0.5rem;
//   color: #444;
// `;

// const Input = styled.input`
//   padding: 0.75rem;
//   border: 1px solid #ccc;
//   border-radius: 0.5rem;
//   font-size: 1rem;
//   &:focus {
//     border-color: #667eea;
//     outline: none;
//     box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
//   }
// `;

// const Select = styled.select`
//   padding: 0.75rem;
//   border-radius: 0.5rem;
//   border: 1px solid #ccc;
//   background-color: #f9f9f9;
//   font-size: 0.95rem;
//   height: 150px;
//   &:focus {
//     border-color: #667eea;
//     outline: none;
//     box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
//   }
// `;

// const Button = styled.button`
//   padding: 0.75rem;
//   background-color: #667eea;
//   color: white;
//   border: none;
//   border-radius: 0.5rem;
//   cursor: pointer;
//   font-weight: bold;
//   transition: background-color 0.3s;
//   &:hover {
//     background-color: #5a67d8;
//   }
// `;

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     courses: [],
//   });

//   const handleChange = e => {
//     const { name, value } = e.target;
//     if (name === 'courses') {
//       const selected = Array.from(e.target.selectedOptions).map(option => option.value);
//       setFormData({ ...formData, courses: selected });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/users/signup', formData);

// localStorage.setItem('auth_token', 'fake_jwt_token');
// localStorage.setItem('courses', JSON.stringify(formData.courses));

// navigate('/home');

//     } catch (error) {
//       alert(error.response?.data?.message || 'Signup failed');
//     }
//   };

//   return (
//     <Container>
//       <Form onSubmit={handleSubmit}>
//         <Title>Sign Up</Title>

//         <Label htmlFor="name">Full Name</Label>
//         <Input name="name" id="name" placeholder="Full Name" onChange={handleChange} required />

//         <Label htmlFor="email">Email</Label>
//         <Input name="email" id="email" type="email" placeholder="Email" onChange={handleChange} required />

//         <Label htmlFor="password">Password</Label>
//         <Input name="password" id="password" type="password" placeholder="Password" onChange={handleChange} required />

//         <Label htmlFor="courses">Select Courses</Label>
//         <Select name="courses" id="courses" multiple size={6} onChange={handleChange} required>
//           <option value="jee">JEE</option>
//           <option value="neet">NEET</option>
//           <option value="upsc">UPSC</option>
//           <option value="railway">Railway</option>
//           <option value="banking">Banking</option>
//           <option value="nda">NDA</option>
//           <option value="ssc">SSC</option>
//         </Select>

//         <Button type="submit">Register</Button>
//       </Form>
//     </Container>
//   );
// };

// export default Login;
