import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // for navigation
import styles from '../Styles/AddAgentForm.module.css';

const AddAgentForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/agents/add', {
        name,
        email,
        mobile,
        password,
      });

      setSuccess(response.data.message); // Set success message
      setError(''); // Clear any previous error
      // Clear the form after successful agent creation
      setName('');
      setEmail('');
      setMobile('');
      setPassword('');
    } catch (err) {
      setError(err.response.data.message); // Set error message
      setSuccess(''); // Clear any previous success
    }
  };

  const handleBack = () => {
    navigate('/dashboard'); // Navigate back to the dashboard
  };

  return (
    <div className={styles.addAgentContainer}>
      <button onClick={handleBack} className={styles.backButton}>Back to Dashboard</button>
      <h3>Add New Agent</h3>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mobile Number</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            minLength={10} // Minimum length of 10 digits
            maxLength={10} // Maximum length of 10 digits
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Agent</button>
      </form>
    </div>
  );
};

export default AddAgentForm;
