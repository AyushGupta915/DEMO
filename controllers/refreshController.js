const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    try {
        const foundUser = await User.findOne({ refreshToken });
        if (!foundUser) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || decoded.username !== foundUser.username) {
                return res.sendStatus(403);
            }

            const roles = [...foundUser.roles.values()];

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
