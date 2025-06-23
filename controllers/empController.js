const Employee = require('../models/employee');

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found." });
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createNewEmployee = async (req, res) => {
    const { name, position } = req.body;

    if (!name || !position) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newEmployee = await Employee.create({ name: name.trim(), position: position.trim() });
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateEmployee = async (req, res) => {
    const { id, name, position } = req.body;

    if (!id || !name || !position) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ message: "Employee not found." });

        employee.name = name.trim();
        employee.position = position.trim();
        const updated = await employee.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteEmployee = async (req, res) => {
    const { id } = req.body;

    try {
        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ message: "Employee not found." });

        await employee.deleteOne();
        res.json({ message: `Deleted employee ${employee.name}`, data: employee });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee
};
