const express = require("express");
const connection = require("../connection");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

const exceljs = require("exceljs");

//const json2csv = require("json2csv").parse;
//const exceljs = require("exceljs");
const fs = require("fs");

var auth = require("../services/authentication");
var checkRoleRH = require("../services/checkRole");

router.post(
  "/addEmployee",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res, next) => {
    let employeeBody = req.body;

    connection.query(
      "SELECT Matricule FROM employee WHERE Matricule = ?",
      [employeeBody.Matricule],
      (err, results) => {
        if (err) {
          return res.status(500).json(err);
        }
        if (results.length > 0) {
          return res.status(400).json({ message: "Matricule already exists" });
        } else {
          let employeeQuery =
            "INSERT INTO employee (Matricule, FullName, SituationFamiliale, Genre, Cin, DateNaissance, LieuNaissance, Formation, Specialite, NiveauEtude, ChefFamille, NbrEnfants, SoldeConge, Cnss, Assurance, EmailPro, TelPerso, TelPro, Adresse, CodePostal, Titre, Poste, Responsable, Manager, Teamleader, Departement, Planification, DateEmbauche, Activite) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          let employeeValues = [
            employeeBody.Matricule,
            employeeBody.FullName,
            employeeBody.SituationFamiliale,
            employeeBody.Genre,
            employeeBody.Cin,
            employeeBody.DateNaissance,
            employeeBody.LieuNaissance,
            employeeBody.Formation,
            employeeBody.Specialite,
            employeeBody.NiveauEtude,
            employeeBody.ChefFamille,
            employeeBody.NbrEnfants,
            employeeBody.SoldeConge,
            employeeBody.Cnss,
            employeeBody.Assurance,
            employeeBody.EmailPro,
            employeeBody.TelPerso,
            employeeBody.TelPro,
            employeeBody.Adresse,
            employeeBody.CodePostal,
            employeeBody.Titre,
            employeeBody.Poste,
            employeeBody.Responsable,
            employeeBody.Manager,
            employeeBody.Teamleader,
            employeeBody.Departement,
            employeeBody.Planification,
            employeeBody.DateEmbauche,
            employeeBody.Activite,
          ];

          connection.query(employeeQuery, employeeValues, (err, results) => {
            if (err) {
              return res.status(500).json(err);
            }
            let contratQuery =
              "INSERT INTO contrat (Matricule, FullName, TypeContrat, Salaire, DateDeb, DateFin) VALUES (?,?,?,?,?,?)";
            let contratValues = [
              employeeBody.Matricule,
              employeeBody.FullName,
              employeeBody.TypeContrat,
              employeeBody.Salaire,
              employeeBody.DateDeb,
              employeeBody.DateFin,
            ];

            connection.query(contratQuery, contratValues, (err, results) => {
              if (err) {
                return res.status(500).json(err);
              }
              let infobancaireQuery =
                "INSERT INTO infobancaires (Matricule, FullName, Banque, Rib) VALUES (?,?,?,?)";
              let infobancaireValues = [
                employeeBody.Matricule,
                employeeBody.FullName,
                employeeBody.Banque,
                employeeBody.Rib,
              ];

              connection.query(
                infobancaireQuery,
                infobancaireValues,
                (err, results) => {
                  if (err) {
                    return res.status(500).json(err);
                  }
                  let userQuery =
                    "INSERT INTO user (Matricule, Password, Role, StatusAccount) VALUES (?,?,?,?)";
                  let userValues = [employeeBody.Matricule, "", "ADMIN", 0];

                  connection.query(userQuery, userValues, (err, results) => {
                    if (err) {
                      return res.status(500).json(err);
                    }
                    const defaultDate = "1000-01-01";

                    let dpteamleader =
                      employeeBody.dpteamleader !== undefined
                        ? employeeBody.dpteamleader
                        : defaultDate;
                    let dpmanager =
                      employeeBody.dpmanager !== undefined
                        ? employeeBody.dpmanager
                        : defaultDate;
                    let dpresponsable =
                      employeeBody.dpresponsable !== undefined
                        ? employeeBody.dpresponsable
                        : defaultDate;

                    let postehistoryQuery =
                      "INSERT INTO postehistory (Matricule, dpteamleader, dpmanager, dpresponsable) VALUES (?, ?, ?, ?)";
                    let postehistoryValues = [
                      employeeBody.Matricule,
                      dpteamleader,
                      dpmanager,
                      dpresponsable,
                    ];

                    connection.query(
                      postehistoryQuery,
                      postehistoryValues,
                      (err, results) => {
                        if (err) {
                          return res.status(500).json(err);
                        }
                        return res.status(200).json({
                          message:
                            "Employee, contract, bank information, user account, and postehistory added successfully",
                        });
                      }
                    );
                  });
                }
              );
            });
          });
        }
      }
    );
  }
);
//get_Employee
router.get(
  "/getAllEmployee",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    var query =
      "select e.Matricule, e.FullName, e.ImageProfil, e.SituationFamiliale, e.Genre, e.Cin, DATE_FORMAT(e.DateNaissance, '%Y-%m-%d') AS DateNaissance, e.LieuNaissance, e.Formation, e.Specialite, e.NiveauEtude, e.ChefFamille, e.NbrEnfants, e.SoldeConge, e.Cnss, e.Assurance, e.EmailPro, e.TelPerso, e.TelPro, e.Adresse, e.CodePostal, e.Titre, e.Poste, e.Departement, e.Planification, DATE_FORMAT(e.DateEmbauche, '%Y-%m-%d') AS DateEmbauche, co.TypeContrat, e.Activite, e.Status, DATE_FORMAT(e.DateDepart, '%Y-%m-%d') AS DateDepart, e.MotifDepart, e.TauxHoraire from employee e LEFT JOIN contrat co ON e.Matricule = co.Matricule ";
    connection.query(query, (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
//********************************************* */

//Update_Employe_By_matricule
router.patch(
  "/updateEmployee",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  upload.fields([{ name: "ImageProfil", maxCount: 1 }]),
  (req, res, next) => {
    const employeeQuery = req.query;
    let employeeBody = req.body;

    // let ImageProfil = req.files["ImageProfil"]
    //   ? req.files["ImageProfil"][0]
    //   : null;

    // let ImageProfilBuffer = ImageProfil ? ImageProfil.buffer : null;

    var query =
      "UPDATE employee e " +
      // " LEFT JOIN contrat co ON e.Matricule = co.Matricule " +
      // " LEFT JOIN infobancaires ib ON e.Matricule = ib.Matricule " +
      " SET e.FullName=?, e.SituationFamiliale=?, e.Genre=?, e.Cin=?, e.DateNaissance=?, e.LieuNaissance=?, e.Formation=?, e.Specialite=?, e.NiveauEtude=?, e.ChefFamille=?, e.NbrEnfants=?, e.SoldeConge=?, e.Cnss=?, e.Assurance=?, e.EmailPro=?, e.TelPerso=?, e.TelPro=?, e.Adresse=?, e.CodePostal=?, e.Titre=?, e.Poste=?, e.Departement=?, e.Planification=?, e.DateEmbauche=?, e.Activite=?, e.Status=?, e.DateDepart=?, e.MotifDepart=?, e.TauxHoraire=? " +
      " WHERE e.Matricule=? ";

    connection.query(
      query,
      [
        employeeBody.FullName,
        // ImageProfilBuffer,
        employeeBody.SituationFamiliale,
        employeeBody.Genre,
        employeeBody.Cin,
        employeeBody.DateNaissance,
        employeeBody.LieuNaissance,
        employeeBody.Formation,
        employeeBody.Specialite,
        employeeBody.NiveauEtude,
        employeeBody.ChefFamille,
        employeeBody.NbrEnfants,
        employeeBody.SoldeConge,
        // employeeBody.Banque,
        employeeBody.Cnss,
        employeeBody.Assurance,
        //employeeBody.EmailPerso,
        employeeBody.EmailPro,
        employeeBody.TelPerso,
        employeeBody.TelPro,
        employeeBody.Adresse,
        employeeBody.CodePostal,
        employeeBody.Titre,
        employeeBody.Poste,
        employeeBody.Departement,
        employeeBody.Planification,
        // employeeBody.TypeContrat,
        employeeBody.DateEmbauche,
        employeeBody.Activite,
        employeeBody.Status,
        employeeBody.DateDepart,
        employeeBody.MotifDepart,
        employeeBody.TauxHoraire,
        employeeQuery.Matricule,
      ],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            return res.status(404).json({ message: "Matricule not found" });
          }
          return res
            .status(200)
            .json({ message: "Employee updated Successfully" });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);
//Update_Employe_ImageProfil
router.patch(
  "/updateImageProfil",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  upload.fields([{ name: "ImageProfil", maxCount: 1 }]),
  (req, res, next) => {
    const employeeQuery = req.query;

    let ImageProfil = req.files["ImageProfil"]
      ? req.files["ImageProfil"][0]
      : null;

    let ImageProfilBuffer = ImageProfil ? ImageProfil.buffer : null;

    var query = "UPDATE employee SET ImageProfil=? WHERE Matricule=? ";

    connection.query(
      query,
      [ImageProfilBuffer, employeeQuery.Matricule],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            return res.status(404).json({ message: "Matricule not found" });
          }
          return res
            .status(200)
            .json({ message: "Employee updated Successfully" });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);
//Update_Employe_InfoPerso_By_matricule
router.patch(
  "/updateEmployeeInfoPerso",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,

  (req, res, next) => {
    const employeeQuery = req.query;
    let employeeBody = req.body;

    var query =
      "UPDATE employee e " +
      " SET e.TelPerso=?, e.Adresse=?, e.CodePostal=?, e.DateNaissance=?, e.Formation=?, e.NiveauEtude=?, e.Specialite=?, e.LieuNaissance=?, e.SituationFamiliale=?, e.ChefFamille=?, e.NbrEnfants=? " +
      " WHERE e.Matricule=? ";

    connection.query(
      query,
      [
        employeeBody.TelPerso,
        //employeeBody.EmailPerso,
        employeeBody.Adresse,
        employeeBody.CodePostal,
        employeeBody.DateNaissance,
        employeeBody.Formation,
        employeeBody.NiveauEtude,
        employeeBody.Specialite,
        employeeBody.LieuNaissance,
        employeeBody.SituationFamiliale,
        employeeBody.ChefFamille,
        employeeBody.NbrEnfants,

        employeeQuery.Matricule,
      ],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            return res.status(404).json({ message: "Matricule not found" });
          }
          return res
            .status(200)
            .json({ message: "Employee InfoPerso updated Successfully" });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);
router.delete(
  "/deleteEmployeeById",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    const EmployeeQuery = req.query;

    const disableForeignKeyQuery = "SET foreign_key_checks = 0";
    connection.query(disableForeignKeyQuery, (disableErr) => {
      if (disableErr) {
        return res.status(500).json({
          message: "Error disabling foreign key checks",
          error: disableErr,
        });
      }

      const deleteEmployeeQuery = "DELETE FROM employee WHERE Matricule=?";
      connection.query(
        deleteEmployeeQuery,
        [EmployeeQuery.Matricule],
        (deleteErr, employeeResults) => {
          const enableForeignKeyQuery = "SET foreign_key_checks = 1";
          connection.query(enableForeignKeyQuery, (enableErr) => {
            if (enableErr) {
              return res.status(500).json({
                message: "Error enabling foreign key checks",
                error: enableErr,
              });
            }

            if (deleteErr) {
              return res
                .status(500)
                .json({ message: "Error deleting employee", error: deleteErr });
            }

            if (employeeResults.affectedRows > 0) {
              const deleteContratQuery =
                "DELETE FROM contrat WHERE Matricule=?";
              const deleteInfobancairesQuery =
                "DELETE FROM infobancaires WHERE Matricule=?";
              const deleteUserQuery = "DELETE FROM user WHERE Matricule=?";

              connection.query(
                deleteContratQuery,
                [EmployeeQuery.Matricule],
                (contratErr, contratResults) => {
                  if (contratErr) {
                    return res.status(500).json({
                      message: "Error deleting contrat entries",
                      error: contratErr,
                    });
                  }

                  connection.query(
                    deleteInfobancairesQuery,
                    [EmployeeQuery.Matricule],
                    (infobancairesErr, infobancairesResults) => {
                      if (infobancairesErr) {
                        return res.status(500).json({
                          message: "Error deleting infobancaires entries",
                          error: infobancairesErr,
                        });
                      }

                      connection.query(
                        deleteUserQuery,
                        [EmployeeQuery.Matricule],
                        (userErr, userResults) => {
                          if (userErr) {
                            return res.status(500).json({
                              message: "Error deleting user entries",
                              error: userErr,
                            });
                          }

                          return res.status(200).json({
                            message: "Employee deleted successfully",
                          });
                        }
                      );
                    }
                  );
                }
              );
            } else {
              return res.status(404).json({ message: "Employee not found" });
            }
          });
        }
      );
    });
  }
);
//Update_Employe_Affectation
router.patch(
  "/updateEmployeeAFFECT",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res, next) => {
    const employeeQuery = req.query;
    let employeeBody = req.body;

    let queryParameters = [];
    let queryValues = [];

    if (employeeBody.Responsable !== undefined) {
      queryParameters.push("Responsable = ?");
      queryValues.push(employeeBody.Responsable || null);
    }
    if (employeeBody.Manager !== undefined) {
      queryParameters.push("Manager = ?");
      queryValues.push(employeeBody.Manager || null);
    }
    if (employeeBody.Teamleader !== undefined) {
      queryParameters.push("Teamleader = ?");
      queryValues.push(employeeBody.Teamleader || null);
    }

    if (queryParameters.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    let query =
      "UPDATE employee SET " +
      queryParameters.join(", ") +
      " WHERE Matricule = ?";

    queryValues.push(employeeQuery.Matricule);

    connection.query(query, queryValues, (err, results) => {
      if (!err) {
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Matricule not found" });
        }
        return res
          .status(200)
          .json({ message: "Employee Affect updated successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
//Get_Employee_Matricule_and_FullName_By_Poste
router.get(
  "/getEmployeesByPoste",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    // const { Poste } = req.query;
    var query = "SELECT Matricule, FullName, Poste FROM employee ";

    connection.query(query, (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.get("/exportAllEmployees", auth.authenticateToken, (req, res) => {
  var query =
    "select e.Matricule, e.FullName, e.SituationFamiliale, e.Genre, e.Cin, DATE_FORMAT(e.DateNaissance, '%Y-%m-%d') AS DateNaissance, e.LieuNaissance, e.Formation, e.Specialite, e.NiveauEtude, e.ChefFamille, e.NbrEnfants, e.SoldeConge, e.Cnss, e.Assurance, e.EmailPro, e.TelPerso, e.TelPro, e.Adresse, e.CodePostal, e.Titre, e.Poste, e.Departement, e.Planification, DATE_FORMAT(e.DateEmbauche, '%Y-%m-%d') AS DateEmbauche, e.Activite, e.Status, e.DateDepart, co.TypeContrat, co.Salaire, co.DateDeb, co.DateFin from employee e LEFT JOIN contrat co ON e.Matricule = co.Matricule ";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    worksheet.columns = [
      { header: "Matricule", key: "Matricule" },
      { header: "FullName", key: "FullName" },
      { header: "SituationFamiliale", key: "SituationFamiliale" },
      { header: "Genre", key: "Genre" },
      { header: "Cin", key: "Cin" },
      { header: "DateNaissance", key: "DateNaissance" },
      { header: "LieuNaissance", key: "LieuNaissance" },
      { header: "Formation", key: "Formation" },
      { header: "Specialite", key: "Specialite" },
      { header: "NiveauEtude", key: "NiveauEtude" },
      { header: "ChefFamille", key: "ChefFamille" },
      { header: "NbrEnfants", key: "NbrEnfants" },
      { header: "SoldeConge", key: "SoldeConge" },
      { header: "Cnss", key: "Cnss" },
      { header: "Assurance", key: "Assurance" },
      //{ header: "EmailPerso", key: "EmailPerso" },
      { header: "EmailPro", key: "EmailPro" },
      { header: "TelPerso", key: "TelPerso" },
      { header: "TelPro", key: "TelPro" },
      { header: "Adresse", key: "Adresse" },
      { header: "CodePostal", key: "CodePostal" },
      { header: "Titre", key: "Titre" },
      { header: "Poste", key: "Poste" },
      { header: "Departement", key: "Departement" },
      { header: "Planification", key: "Planification" },
      { header: "DateEmbauche", key: "DateEmbauche" },
      { header: "Activite", key: "Activite" },
      { header: "Status", key: "Status" },
      { header: "DateDepart", key: "DateDepart" },
      { header: "MotifDepart", key: "MotifDepart" },
    ];

    results.forEach((employee) => {
      worksheet.addRow(employee);
    });

    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=employees.xlsx"
        );
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.send(buffer);
      })
      .catch((err) => {
        return res.status(500).json({ message: "Error generating Excel file" });
      });
  });
});

//POSTE
router.get(
  "/getEmployeeByMatricule",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,

  (req, res) => {
    const employeeQuery = req.query;
    var query =
      "SELECT e.Matricule, e.FullName, e.SituationFamiliale, e.Genre, e.Cin, DATE_FORMAT(e.DateNaissance, '%Y-%m-%d') AS DateNaissance, e.LieuNaissance, e.Formation, e.Specialite, e.NiveauEtude, e.ChefFamille, e.NbrEnfants, e.SoldeConge, e.Cnss, e.Assurance, e.EmailPro, e.TelPerso, e.TelPro, e.Adresse, e.CodePostal, e.Titre, e.Poste, e.Departement, e.Planification, DATE_FORMAT(e.DateEmbauche, '%Y-%m-%d') AS DateEmbauche, e.Activite, e.Status, DATE_FORMAT(e.DateDepart, '%Y-%m-%d') AS DateDepart, e.MotifDepart, e.TauxHoraire, e.ImageProfil, e.Teamleader, e.Manager, e.Responsable, co.TypeContrat, co.Salaire, DATE_FORMAT(co.DateDeb, '%Y-%m-%d') AS DateDeb, DATE_FORMAT(co.DateFin, '%Y-%m-%d') AS DateFin, ib.Banque, ib.Rib, resp.FullName AS ResponsableFullName, mgr.FullName AS ManagerFullName, tl.FullName AS TeamleaderFullName, DATE_FORMAT(ph.dpteamleader, '%Y-%m-%d') AS dpteamleader, DATE_FORMAT(ph.dpmanager, '%Y-%m-%d') AS dpmanager, DATE_FORMAT(ph.dpresponsable, '%Y-%m-%d') AS dpresponsable FROM employee e LEFT JOIN contrat co ON e.Matricule = co.Matricule LEFT JOIN infobancaires ib ON e.Matricule = ib.Matricule LEFT JOIN employee resp ON e.Responsable = resp.Matricule LEFT JOIN employee mgr ON e.Manager = mgr.Matricule LEFT JOIN employee tl ON e.Teamleader = tl.Matricule LEFT JOIN postehistory ph ON e.Matricule = ph.Matricule WHERE e.Matricule=?";
    connection.query(query, [employeeQuery.Matricule], (err, results) => {
      if (!err) {
        results.forEach((employee) => {
          const dateEmbauche = new Date(employee.DateEmbauche);
          const currentDate = new Date();
          const diffTime = Math.abs(currentDate - dateEmbauche);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const years = Math.floor(diffDays / 365);
          const months = Math.floor((diffDays % 365) / 30);
          const days = diffDays % 30;

          employee.DateEmbauche_Anciennete = { years, months, days };
        });

        results.forEach((employee) => {
          const dpteamleader = new Date(employee.dpteamleader);
          if (dpteamleader) {
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - dpteamleader);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const years = Math.floor(diffDays / 365);
            const months = Math.floor((diffDays % 365) / 30);
            const days = diffDays % 30;

            employee.dpteamleader_Anciennete = { years, months, days };
          }
        });

        results.forEach((employee) => {
          const dpmanager = new Date(employee.dpmanager);
          if (dpmanager) {
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - dpmanager);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const years = Math.floor(diffDays / 365);
            const months = Math.floor((diffDays % 365) / 30);
            const days = diffDays % 30;

            employee.dpmanager_Anciennete = { years, months, days };
          }
        });

        results.forEach((employee) => {
          const dpresponsable = new Date(employee.dpresponsable);
          if (dpresponsable) {
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - dpresponsable);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const years = Math.floor(diffDays / 365);
            const months = Math.floor((diffDays % 365) / 30);
            const days = diffDays % 30;

            employee.dpresponsable_Anciennete = { years, months, days };
          }
        });

        results.forEach((employee) => {
          if (employee.DateDepart) {
            const dateEmbauche = new Date(employee.DateEmbauche);
            const dateDepart = new Date(employee.DateDepart);
            const diffTime = Math.abs(dateDepart - dateEmbauche);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const years = Math.floor(diffDays / 365);
            const months = Math.floor((diffDays % 365) / 30);
            const days = diffDays % 30;

            employee.totalperiode = { years, months, days };
          } else {
            employee.totalperiode = employee.DateEmbauche_Anciennete;
          }
        });

        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

//Update_Employe_InfoPerso_By_matricule
router.patch(
  "/updateEmployeeInfoPoste",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res, next) => {
    const employeePosteQuery = req.query;
    const employeePosteBody = req.body;

    let query = "UPDATE postehistory ph SET ";
    let queryParams = [];
    let updateFields = [];

    // Check which field is provided and add it to updateFields array
    if (employeePosteBody.dpteamleader !== undefined) {
      updateFields.push("ph.dpteamleader=?");
      queryParams.push(employeePosteBody.dpteamleader);
    }
    if (employeePosteBody.dpmanager !== undefined) {
      updateFields.push("ph.dpmanager=?");
      queryParams.push(employeePosteBody.dpmanager);
    }
    if (employeePosteBody.dpresponsable !== undefined) {
      updateFields.push("ph.dpresponsable=?");
      queryParams.push(employeePosteBody.dpresponsable);
    }

    // Check if no field is provided for update
    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid field provided for update" });
    }

    query += updateFields.join(", ");
    query += " WHERE ph.Matricule=?";

    queryParams.push(employeePosteQuery.Matricule);

    connection.query(query, queryParams, (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "Matricule not found" });
        }
        return res
          .status(200)
          .json({ message: "Employee Poste Info updated Successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

module.exports = router;
