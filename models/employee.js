const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true }
});

const employee = mongoose.model.Employee || mongoose.model('Employee', employeeSchema);
module.exports = employee;
