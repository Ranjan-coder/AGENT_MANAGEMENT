const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }, // Reference to Agent
});

module.exports = mongoose.model('Task', TaskSchema);
