const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(401).json({ message: "Unauthorized: Invalid credentials." });
    }

    const roles = [...foundUser.roles.values()];

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

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true
    });

    res.status(200).json({
      message: `Login successful. Welcome, ${username}!`,
      accessToken
    });

  } catch (err) {
    console.error("Login error:", err);
    res.sendStatus(500);
  }
};

module.exports = { handleLogin };
