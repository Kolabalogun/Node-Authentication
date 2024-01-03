const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  const findUser = userDB.users.find(
    (user) => user.refreshToken === refreshToken
  );

  if (!findUser) return res.sendStatus(403); // Forbidden

  // Evaluate JWT
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || findUser.username !== decoded.username)
      return res.sendStatus(403); // InvALID token

    const accessToken = jwt.sign(
      {
        username: findUser.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "300s" }
    );

    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
