const express = require('express');
const employeeRouter = express.Router();
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyJWT = require('../../middleware/verifyJwt'); // ✅ Add this

const {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
} = require('../../controllers/empController');

// 🧠 Apply verifyJWT before role checks
employeeRouter.route('/')
    .get(verifyJWT, getAllEmployees)
    .post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createNewEmployee)
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), deleteEmployee);

employeeRouter.route('/:id')
    .get(verifyJWT, getEmployee); // ✅ Protect this if needed

module.exports = employeeRouter;
