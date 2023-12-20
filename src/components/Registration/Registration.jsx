import React, { useState } from "react";
import { firebase } from "../config";
import { useNavigate } from "react-router-dom";

import './Registration.css'

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
  
    const navigate = useNavigate();
  
    const registerUser = async (email, password, firstName, lastName) => {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = firebase.auth().currentUser;
    
        await user.sendEmailVerification({
          handleCodeInApp: true,
          url: 'https://test-b2b2e.firebaseapp.com',
        });
    
        alert('Verification email sent');
    
        const verificationTimer = setTimeout(async () => {
          if (!user.emailVerified) {
            alert('Email verification expired. Please register again.');
            await user.delete();
  
            navigate('/');
          }
        }, 5 * 60 * 1000); 
    
        await user.reload(); 
        while (!user.emailVerified) {
          await user.reload(); 
        }
    
        clearTimeout(verificationTimer);
    
        await firebase.firestore().collection('admin').doc(user.uid).set({
          firstName,
          lastName,
          email,
        });
    
        navigate('/');
      } catch (error) {
        alert(error.message);
      }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        registerUser(email, password, firstName, lastName);
    };

  return (
    <div className="register_container1">
      <div className="register_container2">
        
        <h2>Register</h2>
        <form onSubmit={handleRegisterSubmit}>
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit">Register</button>
        </form>
      
      </div>
    </div>
  );
};

export default Register;
