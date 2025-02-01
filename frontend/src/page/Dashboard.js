import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Styles/Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate();

  const addAgent = () => {
    navigate('/agent'); 
  };

  useEffect(() => {
    const fetchAgents = async () => {
      const { data } = await axios.get('http://localhost:5000/api/agents');
      setAgents(data);
    };

    fetchAgents();
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={addAgent} className={styles.addAgentButton}>Add Agent</button>
      </div>

      {/* Conditionally render the message or agent list */}
      {agents.length === 0 ? (
        <p className={styles.noAgentsMessage}>No agents available. Add an agent!</p>
      ) : (
        <ul className={styles.agentList}>
          {agents.map(agent => (
            <li key={agent._id} className={styles.agentListItem}>
              {agent.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
