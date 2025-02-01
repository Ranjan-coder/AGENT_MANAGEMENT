const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Agent = require('../Models/Agent.model'); 
const Task = require('../Models/Task.model');
const xlsx = require('xlsx');

// Set up multer for file upload (supporting CSV, XLSX, and XLS formats)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /csv|xlsx|xls/;
    const extname = fileTypes.test(file.mimetype);
    const mimetype = fileTypes.test(file.originalname);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: File type must be .csv, .xlsx, or .xls');
  },
});

// Endpoint to handle CSV upload
exports.uploadCSV = upload.single('file');

// Function to parse CSV, XLS, or XLSX files and distribute tasks
exports.processCSV = async (req, res) => {
  const filePath = req.file.path;
  const tasks = [];

  // Determine file extension and process accordingly
  const extname = filePath.split('.').pop();
  if (extname === 'csv') {
    // Process CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        tasks.push({
          firstName: row.FirstName,
          phone: row.Phone,
          notes: row.Notes,
        });
      })
      .on('end', async () => {
        await distributeTasks(tasks, res);
      })
      .on('error', (err) => {
        res.status(500).json({ message: 'Error processing CSV', error: err.message });
      });
  } else if (extname === 'xlsx' || extname === 'xls') {
    // Process XLSX file
    const workbook = xlsx.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheet_name_list[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
    jsonData.forEach(row => {
      tasks.push({
        firstName: row.FirstName,
        phone: row.Phone,
        notes: row.Notes,
      });
    });
    
    await distributeTasks(tasks, res);
  } else {
    res.status(400).json({ message: 'Invalid file format. Only CSV, XLSX, and XLS files are allowed.' });
  }
};

// Task Distribution Logic
const distributeTasks = async (tasks, res) => {
  const agents = await Agent.find();
  const numberOfAgents = agents.length;

  if (numberOfAgents === 0) {
    return res.status(400).json({ message: 'No agents available to assign tasks.' });
  }

  const tasksPerAgent = Math.floor(tasks.length / numberOfAgents);
  let taskIndex = 0;

  // Distribute tasks evenly among agents
  for (let i = 0; i < numberOfAgents; i++) {
    const agentTasks = tasks.slice(taskIndex, taskIndex + tasksPerAgent);
    taskIndex += tasksPerAgent;

    // Handle remaining tasks if not divisible evenly
    if (taskIndex > tasks.length) {
      taskIndex = tasks.length;
    }

    // Save the tasks for the agent
    for (const task of agentTasks) {
      await Task.create({ ...task, agent: agents[i]._id });
    }
  }

  // If there are remaining tasks after even distribution, distribute them sequentially
  const remainingTasks = tasks.slice(taskIndex);
  for (let i = 0; i < remainingTasks.length; i++) {
    const agent = agents[i % numberOfAgents];
    await Task.create({ ...remainingTasks[i], agent: agent._id });
  }

  res.json({ message: 'CSV processed and tasks distributed' });
};
