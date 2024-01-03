const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username or password is required" });

  const duplicate = userDB.users?.find((user) => user.username === username);

  if (duplicate) return res.status(409).json({ message: "Conflict" }); // conflict

  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username: username, password: hashedPassword };

    userDB.setUsers([...userDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),

      JSON.stringify(userDB.users)
    );
    console.log(userDB.users);
    res.status(201).json({ success: `New User ${username} has been created` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // server error
  }
};

module.exports = { handleNewUser };
