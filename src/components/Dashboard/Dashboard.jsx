import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { updateStoredCredentials } from '../authUtils';
import { firebase } from '../config';

import './Dashboard.css';

const Dashboard = () => {

  const navigate = useNavigate();

  const handleSignOut = () => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            updateStoredCredentials();
            navigate('/');
        })
        .catch((error) => {
            alert(error.message);
        });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-menu">
        <h2>Dashboard</h2>
        <ul>
          <li>
            <Link to="/categories">Categories</Link>
          </li>
          <li>
            <Link to="/orders">Orders</Link>
          </li>
        </ul>
      </div>
      <div className="dashboard-content">
          <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
};

export default Dashboard;
