const User = require('../models/users');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    try {
        const user = await User.findOne({ refreshToken });

        if (!user) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }

        user.refreshToken = '';
        await user.save();

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.status(200).json({ message: "Logout successful." });

    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = { handleLogout };
