const express = require("express");
const connection = require("../connection");
const router = express.Router();

var auth = require("../services/authentication");
var checkRoleRH = require("../services/checkRole");

//get All InfoBank
router.get(
  "/getAllInfoBank",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    var query =
      "SELECT ib.Matricule, e.FullName, ib.Banque, ib.Rib, ib.RibDansDossier  FROM infobancaires ib LEFT JOIN employee e ON ib.Matricule = e.Matricule";

    connection.query(query, (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
//get All InfoBank By Matricule
router.get(
  "/getInfoBankByMatricule",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    const ibMatriculeQuery = req.query;
    var query =
      "SELECT ib.Matricule, ib.FullName, ib.Banque, ib.Rib, ib.RibDansDossier  FROM infobancaires ib LEFT JOIN employee e ON ib.Matricule = e.Matricule where ib.Matricule=? ";

    connection.query(query, [ibMatriculeQuery.Matricule], (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
//Update InfoBank By Matricule
router.patch(
  "/updateInfoBank",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  async (req, res) => {
    const infobankQuery = req.query;
    const infobankBody = req.body;
    try {
      if (!infobankQuery.Matricule) {
        return res.status(400).json({ message: "Matricule is required" });
      }
      let updateFields = [];
      let queryParams = [];
      if (infobankBody.Banque) {
        updateFields.push("Banque = ?");
        queryParams.push(infobankBody.Banque);
      }
      if (infobankBody.Rib) {
        updateFields.push("Rib = ?");
        queryParams.push(infobankBody.Rib);
      }

      if (infobankBody.RibDansDossier !== undefined) {
        updateFields.push("RibDansDossier = ?");
        queryParams.push(infobankBody.RibDansDossier);
      }
      if (updateFields.length === 0) {
        return res.status(400).json({ message: "Nothing to update" });
      }
      queryParams.push(infobankQuery.Matricule);
      const query =
        "UPDATE infobancaires SET " +
        updateFields.join(", ") +
        " WHERE Matricule = ?";
      connection.query(query, queryParams, (err, results) => {
        if (err) {
          console.error("Error updating infoBank:", err);
          return res.status(500).json({ error: "Failed to update Info Bank" });
        }
        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Info Bank with matricule does not exist" });
        }
        return res
          .status(200)
          .json({ message: "Info Bank updated successfully" });
      });
    } catch (error) {
      console.error("Internal server error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
// Delete InfoBank By Matricule
router.delete(
  "/deleteInfoBankByMatricule",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    const infobankQuery = req.query;
    var query = "DELETE FROM infobancaires WHERE Matricule=? ";

    connection.query(query, [infobankQuery.Matricule], (err, results) => {
      if (!err) {
        if (results.affectedRows > 0) {
          return res
            .status(200)
            .json({ message: "Info Bank deleted successfully" });
        } else {
          return res.status(404).json({ message: "Info Bank not found" });
        }
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

module.exports = router;
