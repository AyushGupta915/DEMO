const bcrypt = require('bcrypt');
const User = require('../models/users');
const ROLES_LIST = require('../config/roles_list');

const handleNewUser = async (req, res) => {
    const { username, password, roles } = req.body;

    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists." });
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        let newUserRoles = {};

        if (roles && typeof roles === 'object') {
            for (const roleName in roles) {
                if (ROLES_LIST[roleName] && roles[roleName]) {
                    newUserRoles[roleName] = ROLES_LIST[roleName];
                }
            }
        }

        if (Object.keys(newUserRoles).length === 0) {
            newUserRoles = { User: ROLES_LIST.User };
        }

        const result = await User.create({
            username: username.trim(),
            password: hashedPwd,
            roles: newUserRoles
        });

        res.status(201).json({ success: `New user '${result.username}' created successfully.` });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Error creating user." });
    }
};

module.exports = { handleNewUser };
