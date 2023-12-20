import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { updateStoredCredentials } from '../authUtils';

import './Login.css'

const Login = () => {

    const navigate = useNavigate();
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    useEffect(() => {
      retrieveStoredCredentials();
    }, []);

    const retrieveStoredCredentials = () => {
        try {
          const storedEmail = localStorage.getItem('userEmail');
          const storedPassword = localStorage.getItem('userPassword');
    
          if (storedEmail && storedPassword)
            loginUser(storedEmail, storedPassword);
        } catch (error) {
          console.error('Error retrieving stored credentials:', error);
        }
    };

    const loginUser = async (email, password) => {
        try {
          await firebase.auth().signInWithEmailAndPassword(email, password);
          updateStoredCredentials(email, password);
          
          navigate('/categories');
        } catch (error) {
          alert(error.message);
        }
    };
    
    const forgetPassword = () => {
      firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent")
      }).catch((error) => {
        alert(error)
      })
    }

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginUser(email, password);
    };

    const googleLogin = async () => {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
    
        const user = result.user;
        const displayName = user.displayName;
        const email = user.email;

        const [firstName, lastName] = displayName.split(' ');

        await firebase.firestore().collection('admin').doc(user.uid).set({
          firstName: firstName,
          lastName: lastName,
          email: email,
        });
        
        navigate('/categories');
      } catch (error) {
        alert(error.message);
      }
    };    


  return (
    <div className="container">
      <div className="container2">
        <h2>Login</h2>
        <form className="input_container" onSubmit={handleLoginSubmit}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit">Login</button>
        </form>
        <p className="register">
          Don't have an account? 
          <Link className="register_user" to="/registration">
            Register here
          </Link>
        </p>
        <p className="forgot_password" onClick={forgetPassword}>
          Forgot Password 
        </p>
      </div>
    </div>
  );
};

export default Login;
