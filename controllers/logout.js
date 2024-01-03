const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  // On Client Make Sure to Delete tthe Access Token

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  // Is Refresh token in DB?
  const findUser = userDB.users.find(
    (user) => user.refreshToken === refreshToken
  );

  // Clear the cookie
  if (!findUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204); // No content
  }

  //   Delete refresh token in DB
  const otherUsers = userDB.users.filter(
    (user) => user.refreshToken !== findUser.refreshToken
  );

  const currentUser = { ...findUser, refreshToken };

  userDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(userDB.users)
  );
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.status(204); // No Content
  res.json({ success: "User logged out successfully" });
};

module.exports = { handleLogout };
