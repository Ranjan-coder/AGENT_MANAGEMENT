const Task = require('../Models/Task.model');
const Agent = require('../Models/Agent.model');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Task Distribution after CSV Upload
exports.uploadCSV = (req, res) => {
  const filePath = req.file.path;
  const tasks = [];
  
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
      const agents = await Agent.find();
      const taskPerAgent = Math.floor(tasks.length / agents.length);
      let taskIndex = 0;

      agents.forEach(async (agent, index) => {
        for (let i = 0; i < taskPerAgent; i++) {
          if (taskIndex < tasks.length) {
            const task = new Task({ ...tasks[taskIndex], assignedAgent: agent._id });
            await task.save();
            taskIndex++;
          }
        }
      });

      res.status(200).json({ message: 'CSV processed and tasks distributed' });
    });
};

// Upload Middleware (for CSV)
const upload = multer({ dest: 'uploads/' });
exports.upload = upload.single('csvFile');
