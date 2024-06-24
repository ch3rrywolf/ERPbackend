const express = require("express");
const connection = require("../connection");
const router = express.Router();
const auth = require("../services/authentication");
var checkRoleAdmin = require("../services/checkRole");
var checkRoleRH = require("../services/checkRole");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
//login_session
router.post("/login", (req, res) => {
  const { Matricule, Password } = req.body;
  const query =
    "SELECT u.Matricule, u.Password , u.Role, u.StatusAccount, e.FullName FROM user u LEFT JOIN employee e ON u.Matricule = e.Matricule WHERE u.Matricule=?";

  connection.query(query, [Matricule], async (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res
          .status(401)
          .json({ message: "Incorrect Matricule or Password!" });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(Password, user.Password);

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ message: "Incorrect Matricule or Password!" });
      }

      if (user.StatusAccount === 0) {
        return res
          .status(401)
          .json({ message: "Votre compte n'est pas vérifier" });
      }

      const response = {
        Matricule: user.Matricule,
        Role: user.Role,
        Nom: user.FullName,
      };

      const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
        expiresIn: "8h",
      });

      res.status(200).json({ token: accessToken, infoPerso: response });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
});
//get_All_users
router.get(
  "/getAllUsers",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    var query =
      "SELECT u.Matricule, e.FullName, u.Password, u.Role, u.StatusAccount  FROM user u LEFT JOIN employee e ON u.Matricule = e.Matricule";

    connection.query(query, (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
//get_users_by_matricule
router.get(
  "/getAllUsersByMatricule",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    const userQuery = req.query;
    var query =
      "SELECT u.Matricule, e.FullName, u.Password, u.Role, u.StatusAccount  FROM user u LEFT JOIN employee e ON u.Matricule = e.Matricule WHERE u.Matricule=?";

    connection.query(query, [userQuery.Matricule], (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
//Update_user_by_Matricule
router.patch(
  "/updateUsers",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,

  async (req, res) => {
    const userQuery = req.query;
    const userBody = req.body;
    try {
      if (!userQuery.Matricule) {
        return res.status(400).json({ message: "Matricule is required" });
      }
      let updateFields = [];
      let queryParams = [];
      if (userBody.Password) {
        const hashedPassword = await bcrypt.hash(userBody.Password, 10);
        updateFields.push("Password = ?");
        queryParams.push(hashedPassword);
      }
      if (userBody.Role) {
        updateFields.push("Role = ?");
        queryParams.push(userBody.Role);
      }
      if (userBody.StatusAccount !== undefined) {
        updateFields.push("StatusAccount = ?");
        queryParams.push(userBody.StatusAccount);
      }
      if (updateFields.length === 0) {
        return res.status(400).json({ message: "Nothing to update" });
      }
      queryParams.push(userQuery.Matricule);
      const query =
        "UPDATE user SET " + updateFields.join(", ") + " WHERE Matricule = ?";
      connection.query(query, queryParams, (err, results) => {
        if (err) {
          console.error("Error updating user:", err);
          return res.status(500).json({ error: "Failed to update user" });
        }
        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "User with matricule does not exist" });
        }
        return res.status(200).json({ message: "User updated successfully" });
      });
    } catch (error) {
      console.error("Internal server error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});

module.exports = router;
