const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const dataPath = path.join(__dirname, '..', 'models', 'users.json');

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        // Read existing users
        const data = await fsPromises.readFile(dataPath, 'utf8');
        const users = JSON.parse(data);

        // Check for duplicate username
        const duplicate = users.find(user => user.username === username);
        if (duplicate) {
            return res.status(409).json({ message: "Username already exists." });
        }

        // Hash the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // New user object
        const newUser = {
            username: username.trim(),
            password: hashedPwd,
            roles: { user: 2001 }
        };

        // Add and save
        users.push(newUser);
        await fsPromises.writeFile(dataPath, JSON.stringify(users, null, 2));

        res.status(201).json({ success: `New user '${username}' created successfully.` });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Error creating user." });
    }
};

module.exports = { handleNewUser };
