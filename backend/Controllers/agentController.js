const Agent = require('../Models/Agent.model');
const bcrypt = require('bcryptjs')

// Add a new agent
// exports.addAgent = async (req, res) => {
//   const { name, email, mobile, password } = req.body;

//   const agent = new Agent({ name, email, mobile, password });
//   await agent.save();
//   res.status(201).json(agent);
// };

// Get all agents
exports.getAgents = async (req, res) => {
  const agents = await Agent.find();
  res.json(agents);
};




// Add new agent
exports.addAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    // Check if the agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent already exists' });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new agent
    const newAgent = new Agent({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    await newAgent.save();

    res.status(201).json({ message: 'Agent added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
