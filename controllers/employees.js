const data = {
  employees: require("../model/employees.json"),
  setEmployee: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees.length + 1 || 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  if (!req.body.firstName || !req.body.lastName) {
    return res
      .status(400)
      .json({ message: "First Name or Last Name is required" });
  }

  data.setEmployee([...data.employees, newEmployee]);

  res.status(201).json(data.employees);
};

const editEmployee = (req, res) => {
  const employee = data.employees.find((emp) => emp.id === req.body.id);

  if (!employee) return res.status(400).json({ message: "Employee not found" });

  if (req.body.firstName) employee.firstName = req.body.firstName;
  if (req.body.lastName) employee.lastName = req.body.lastName;

  const filteredArray = data.employees.filter((emp) => emp.id !== req.body.id);

  const unsortedArray = [...filteredArray, employee];

  const sortedArray = unsortedArray.sort((a, b) =>
    a.id > b.id ? 1 : a.id < b.id ? -1 : 0
  );

  data.setEmployee(sortedArray);
  res.status(201).json(data.employees);
};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find((emp) => emp.id === req.body.id);

  if (!employee) return res.status(400).json({ message: "Employee not found" });

  const filteredArray = data.employees.filter((emp) => emp.id !== req.body.id);

  data.setEmployee(filteredArray);
  res.status(201).json(data.employees);
};

const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );

  if (!employee) return res.status(400).json({ message: "Employee not found" });

  res.status(201).json(employee);
};

module.exports = {
  getAllEmployees,
  getEmployee,
  deleteEmployee,
  createNewEmployee,
  editEmployee,
};
