const path = require('path');
const fsPromises = require('fs').promises;

const dataPath = path.join(__dirname, '..', 'models', 'users.json');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    try {
        const data = await fsPromises.readFile(dataPath, 'utf8');
        const users = JSON.parse(data);

        const foundUserIndex = users.findIndex(user => user.refreshToken === refreshToken);

        if (foundUserIndex === -1) {
            res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
            return res.sendStatus(204);
        }

        users[foundUserIndex].refreshToken = '';

        await fsPromises.writeFile(dataPath, JSON.stringify(users, null, 2));

        res.clearCookie('jwt', { httpOnly: true });

        res.status(200).json({ message: "Logout successful." });

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

module.exports = { handleLogout };
