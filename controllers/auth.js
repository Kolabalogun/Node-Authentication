const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

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
    res.status(201).json({ success: "User logged in successfully" });
  } else res.status(401).json({ message: "Invalid username or password" });
};

module.exports = { handleLogin };
