const express = require("express");
const {
  validatorCreateUser,
  validatorUpdateUser,
  validatorDeleteUser,
} = require("../utils/validation/validatorUser");
const {
  createUser,
  getAllUser,
  getSpecifyUser,
  updateUser,
  deleteUser,
} = require("../server/user-server");
const { protectAuth, allowedTo } = require("../server/auth-server");
const router = express.Router();

router.route("/getDataUser").get(protectAuth, getSpecifyUser);
router.route("/updateDataUser").put(protectAuth, updateUser);

router
  .route("/")
  .post(protectAuth, allowedTo("admin"), validatorCreateUser, createUser)
  .get(protectAuth, allowedTo("admin"), getAllUser);

router
  .route("/:id")
  .get(getSpecifyUser)
  .put(validatorUpdateUser, allowedTo("admin"), updateUser)
  .delete(validatorDeleteUser, allowedTo("admin"), deleteUser);

module.exports = router;
