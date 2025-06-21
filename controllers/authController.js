const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const dataPath = path.join(__dirname, '..', 'models', 'users.json');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        // Read users
        const data = await fsPromises.readFile(dataPath, 'utf8');
        const users = JSON.parse(data);

        // Check user existence
        const foundUserIndex = users.findIndex(user => user.username === username);
        if (foundUserIndex === -1) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const foundUser = users[foundUserIndex];

        // Verify password
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Extract roles
        const roles = Object.values(foundUser.roles || {});

        // Generate tokens
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles: roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '2m' }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Save refresh token to user object
        users[foundUserIndex] = {
            ...foundUser,
            refreshToken
        };

        await fsPromises.writeFile(dataPath, JSON.stringify(users, null, 2));

        // Set refresh token as cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        res.status(200).json({
            message: `Login successful. Welcome, ${username}!`,
            accessToken
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Error logging in." });
    }
};

module.exports = { handleLogin };
