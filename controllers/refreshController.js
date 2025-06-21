const fsPromises = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const dataPath = path.join(__dirname, '..', 'models', 'users.json');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // No cookie

    const refreshToken = cookies.jwt;

    try {
        const data = await fsPromises.readFile(dataPath, 'utf8');
        const users = JSON.parse(data);

        // Find the user with this refresh token
        const foundUser = users.find(user => user.refreshToken === refreshToken);
        if (!foundUser) return res.sendStatus(403); // Forbidden

        // Verify the refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || decoded.username !== foundUser.username) {
                return res.sendStatus(403);
            }

            const roles = Object.values(foundUser.roles || {});

            const newAccessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundUser.username,
                        roles: roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m' }
            );

            res.json({ accessToken: newAccessToken });
        });

    } catch (err) {
        console.error("Error in refresh token handler:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { handleRefreshToken };
