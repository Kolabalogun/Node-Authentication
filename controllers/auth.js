const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and Password is required" });

  const findUser = userDB.users.find((user) => user.username === username);

  if (!findUser)
    return res.status(400).json({ message: "User does not exist" });

  // Evaluate Password

  const match = await bcrypt.compare(password, findUser.password);
  if (match) {
    // Create JWT

    const accessToken = jwt.sign(
      {
        username: findUser.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "300s" }
    );

    const refreshToken = jwt.sign(
      {
        username: findUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Saving the refresh token with the current user
    const otherUsers = userDB.users.filter(
      (user) => user.username !== findUser.username
    );
    const currentUser = { ...findUser, refreshToken };

    userDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(userDB.users)
    );

    // Sending refresH token as cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({ success: "User logged in successfully", accessToken });
  } else res.sendStatus(401); // Unauthorized
};

module.exports = { handleLogin };
