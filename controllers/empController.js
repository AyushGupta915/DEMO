const fs = require('fs');
const path = require('path');

// Load employee data from JSON file
const dataFilePath = path.join(__dirname, '..', 'models', 'employee.json');
const data = {
    employee: require(dataFilePath),
};

// Helper function to save data to JSON file
const saveData = () => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data.employee, null, 2));
};

// GET all employees
const getAllEmployees = (req, res) => {
    res.json(data.employee);
};

// POST create new employee
const createNewEmployee = (req, res) => {
    const newEmployee = {
        id: data.employee.length > 0 ? data.employee[data.employee.length - 1].id + 1 : 1,
        name: req.body.name?.trim(),
        position: req.body.position?.trim(),
    };

    if (!newEmployee.name || !newEmployee.position) {
        return res.status(400).json({ message: "All fields are required." });
    }

    data.employee.push(newEmployee);
    saveData();
    res.status(201).json(newEmployee);
};

// PUT update employee
const updateEmployee = (req, res) => {
    const employeeId = parseInt(req.body.id);
    const employee = data.employee.find(emp => emp.id === employeeId);

    if (!employee) {
        return res.status(404).json({ message: `Employee ID ${employeeId} not found.` });
    }

    if (!req.body.name || !req.body.position) {
        return res.status(400).json({ message: "All fields are required." });
    }

    employee.name = req.body.name.trim();
    employee.position = req.body.position.trim();

    saveData();
    res.json(employee);
};

// DELETE employee
const deleteEmployee = (req, res) => {
    const employeeId = parseInt(req.body.id);
    const index = data.employee.findIndex(emp => emp.id === employeeId);

    if (index === -1) {
        return res.status(404).json({ message: `Employee ID ${employeeId} not found.` });
    }

    const deleted = data.employee.splice(index, 1)[0];
    saveData();
    res.json({ message: `Deleted employee ${deleted.name}`, data: deleted });
};

// GET one employee by ID
const getEmployee = (req, res) => {
    const employeeId = parseInt(req.params.id);
    const employee = data.employee.find(emp => emp.id === employeeId);

    if (!employee) {
        return res.status(404).json({ message: `Employee ID ${employeeId} not found.` });
    }

    res.json(employee);
};

// Export all functions
module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};
