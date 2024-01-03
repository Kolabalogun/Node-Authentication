const express = require("express");
const app = express();
const router = express.Router();

// Import Controller
const {
  getAllEmployees,
  getEmployee,
  deleteEmployee,
  createNewEmployee,
  editEmployee,
} = require("../../controllers/employees");

const data = {};
data.employees = require("../../model/employees.json");

router
  .route("/")
  .get(getAllEmployees)
  .post(createNewEmployee)
  .put(editEmployee)
  .delete(deleteEmployee);

// For params
router.route("/:id").get(getEmployee);

module.exports = router;
