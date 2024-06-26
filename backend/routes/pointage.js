const express = require("express");
const connection = require("../connection");
const multer = require("multer");
const path = require("path");
const csv = require("fast-csv");
const fs = require("fs");
const moment = require("moment");
const exceljs = require("exceljs");
const router = express.Router();

var auth = require("../services/authentication");
var checkRoleRH = require("../services/checkRole");

//import_file_to_table_mysql
//********************************************************* */
let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
let upload = multer({
  storage: storage,
});
///ds

router.post("/importCSVPointageRetard", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filePath = path.join(__dirname, "../uploads/", req.file.filename);
  console.log(filePath);
  uploadCsvPointageRetard(filePath, res);
});

function uploadCsvPointageRetard(filePath, res) {
  let stream = fs.createReadStream(filePath);
  let csvDataColl = [];
  let fileStream = csv
    .parse()
    .on("data", function (data) {
      if (data.length === 3) {
        csvDataColl.push([data[0], data[1], data[2]]);
      } else {
        console.log("Invalid data:", data);
      }
    })
    .on("end", function () {
      csvDataColl.shift();

      let query =
        "INSERT INTO pointageretard (Matricule, DateJour, HeureDep) VALUES ?";
      connection.query(query, [csvDataColl], (error, results) => {
        if (error) {
          console.error("Database error:", error);
          return res.status(500).send("Database query error.");
        }
        console.log("Insertion results:", results);
        res.send("Records imported successfully.");

        fs.unlinkSync(filePath);
      });
    })
    .on("error", function (error) {
      console.error("CSV parsing error:", error);
      res.status(500).send("Error while processing CSV file.");
    });

  stream.pipe(fileStream);
}
//********************************************************* */

////******************************************************************************* */
//************************************PointageRetard******************************* */
////******************************************************************************* */
//get_all_pointage_Retard
router.get(
  "/getAllPointageRetard",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,

  (req, res) => {
    var query =
      "select po.Matricule, e.FullName, DATE_FORMAT(po.DateJour, '%Y-%m-%d') AS DateJour, po.HeureDep, po.Retard, po.CauseRetard from pointageretard po LEFT JOIN employee e ON e.Matricule = po.Matricule ";
    connection.query(query, (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
////******************************************************************************* */
//get_details_Pointage_Retard_By_Matricule
router.get(
  "/getPointageRetardByMatricule",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,

  (req, res) => {
    const pointageQuery = req.query;
    var query =
      "SELECT po.Matricule, e.FullName, DATE_FORMAT(po.DateJour, '%Y-%m-%d') AS DateJour, po.HeureDep, po.Retard, po.CauseRetard from pointageretard po LEFT JOIN employee e ON e.Matricule = po.Matricule WHERE po.Matricule=? AND po.DateJour=?";
    connection.query(
      query,
      [pointageQuery.Matricule, pointageQuery.DateJour],
      (err, results) => {
        if (!err) {
          return res.status(200).json(results);
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);
////******************************************************************************* */
//get_details_Pointage_Retard_By_DateJour
router.get(
  "/getPointageRetardByDateJour",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,

  (req, res) => {
    const pointageDateQuery = req.query;
    var query =
      "SELECT po.Matricule, e.FullName, DATE_FORMAT(po.DateJour, '%Y-%m-%d') AS DateJour, po.HeureDep, po.Retard, po.CauseRetard from pointageretard po LEFT JOIN employee e ON e.Matricule = po.Matricule WHERE po.DateJour=?";
    connection.query(query, [pointageDateQuery.DateJour], (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
////******************************************************************************* */
//update_pointage_Retard_status
router.patch(
  "/UpdateRetard",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res, next) => {
    const { Matricule, DateJour } = req.query;
    const { CauseRetard } = req.body;

    if (!Matricule || !DateJour || !CauseRetard) {
      return res.status(400).json({
        message: "Matricule, DateJour, and CauseRetard are required.",
      });
    }

    const query =
      "UPDATE pointageretard SET CauseRetard=? WHERE Matricule=? AND DateJour=?";
    connection.query(
      query,
      [CauseRetard, Matricule, DateJour],
      (err, results) => {
        if (!err) {
          if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Pointage not found" });
          }
          return res
            .status(200)
            .json({ message: "Pointage Cause updated Successfully" });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);
////******************************************************************************* */

////******************************************************************************* */
////*************************************PointageNormal**************************** */
////******************************************************************************* */
router.post("/importCSVPointageNormal", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filePath = path.join(__dirname, "../uploads/", req.file.filename);
  console.log(filePath);
  uploadCsvPointageNormal(filePath, res);
});

function uploadCsvPointageNormal(filePath, res) {
  let stream = fs.createReadStream(filePath);
  let csvDataColl = [];
  let fileStream = csv
    .parse()
    .on("data", function (data) {
      csvDataColl.push(data);
    })
    .on("end", function () {
      csvDataColl.shift();

      for (let i = 0; i < csvDataColl.length; i++) {
        let row = csvDataColl[i];
        let TimeIn = row[2];
        let PauseOut = row[3];
        let PauseIn = row[4];
        let TimeOut = row[5];

        let HeuresReelles = calculateHeuresReelles(
          TimeIn,
          PauseOut,
          PauseIn,
          TimeOut
        );

        row.push(HeuresReelles);
      }

      let query =
        "INSERT INTO pointagenormal (Matricule, DateJour, TimeIn, PauseOut, PauseIn, TimeOut, HeuresReelles) VALUES ?";
      connection.query(query, [csvDataColl], (error, results) => {
        if (error) {
          console.error("Database error:", error);
          return res.status(500).send("Database query error.");
        }
        console.log("Insertion results:", results);
        res.send("Records imported successfully.");

        fs.unlinkSync(filePath);
      });
    })
    .on("error", function (error) {
      console.error("CSV parsing error:", error);
      res.status(500).send("Error while processing CSV file.");
    });

  stream.pipe(fileStream);
}

function calculateHeuresReelles(TimeIn, PauseOut, PauseIn, TimeOut) {
  let timeIn = moment(TimeIn, "HH:mm:ss");
  let pauseOut = moment(PauseOut, "HH:mm:ss");
  let pauseIn = moment(PauseIn, "HH:mm:ss");
  let timeOut = moment(TimeOut, "HH:mm:ss");

  if (PauseOut === "00:00:00" && PauseIn === "00:00:00") {
    let heuresReelles = moment.duration(timeOut.diff(timeIn));
    let hours = Math.floor(heuresReelles.asHours());
    let minutes = Math.floor(heuresReelles.asMinutes()) % 60;
    let seconds = Math.floor(heuresReelles.asSeconds()) % 60;

    return `${hours}:${minutes}:${seconds}`;
  } else {
    let heuresReelles = moment
      .duration(timeOut.diff(pauseIn))
      .add(moment.duration(pauseOut.diff(timeIn)));

    let hours = Math.floor(heuresReelles.asHours());
    let minutes = Math.floor(heuresReelles.asMinutes()) % 60;
    let seconds = Math.floor(heuresReelles.asSeconds()) % 60;

    return `${hours}:${minutes}:${seconds}`;
  }
}
////******************************************************************************* */
router.get(
  "/getAllPointageNormal",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,

  (req, res) => {
    var query =
      "select pon.Matricule, e.FullName, DATE_FORMAT(pon.DateJour, '%Y-%m-%d') AS DateJour, pon.TimeIn, pon.PauseOut, pon.PauseIn, pon.TimeOut, pon.HeuresReelles, pon.Remarques from pointagenormal pon LEFT JOIN employee e ON e.Matricule = pon.Matricule ";
    connection.query(query, (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
////******************************************************************************* */
router.patch(
  "/UpdateNormal",

  (req, res, next) => {
    const { Matricule, DateJour } = req.query;
    const { Remarques } = req.body;

    if (!Matricule || !DateJour || !Remarques) {
      return res.status(400).json({
        message: "Matricule, DateJour, and Remarques are required.",
      });
    }

    const query =
      "UPDATE pointagenormal SET Remarques=? WHERE Matricule=? AND DateJour=?";
    connection.query(
      query,
      [Remarques, Matricule, DateJour],
      (err, results) => {
        if (!err) {
          if (results.affectedRows === 0) {
            return res
              .status(404)
              .json({ message: "Pointage Normal not found" });
          }
          return res
            .status(200)
            .json({ message: "Remarques updated Successfully" });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);
////******************************************************************************* */
router.get(
  "/getPointageNormalByMatricule",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,

  (req, res) => {
    const pointageQuery = req.query;
    var query =
      "SELECT pon.Matricule, e.FullName, DATE_FORMAT(pon.DateJour, '%Y-%m-%d') AS DateJour, pon.TimeIn, pon.PauseOut, pon.PauseIn, pon.TimeOut, pon.HeuresReelles, pon.Remarques from pointagenormal pon LEFT JOIN employee e ON e.Matricule = pon.Matricule WHERE pon.Matricule=? AND pon.DateJour=? ";

    connection.query(
      query,
      [pointageQuery.Matricule, pointageQuery.DateJour],
      (err, results) => {
        if (!err) {
          return res.status(200).json(results);
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);
/*/////////////////////////////*/
router.get(
  "/getTotalHeuresByMatriculeDSDE",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    const { Matricule, DateStart, DateEnd } = req.query;

    if (DateStart && DateEnd) {
      var query =
        "SELECT pon.Matricule, e.FullName, SEC_TO_TIME(SUM(TIME_TO_SEC(HeuresReelles))) AS TotalHT FROM pointagenormal pon LEFT JOIN employee e ON e.Matricule = pon.Matricule WHERE pon.Matricule=? AND pon.DateJour BETWEEN ? AND ? GROUP BY pon.Matricule";
      var queryParams = [Matricule, DateStart, DateEnd];
    } else {
      var query =
        "SELECT pon.Matricule, e.FullName, SEC_TO_TIME(SUM(TIME_TO_SEC(HeuresReelles))) AS TotalHT FROM pointagenormal pon LEFT JOIN employee e ON e.Matricule = pon.Matricule WHERE pon.Matricule=? GROUP BY pon.Matricule";
      var queryParams = [Matricule];
    }

    connection.query(query, queryParams, (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
//get all data with DateStart and DateEnd OR || OR without DateStart and DateEnd
router.get(
  "/getTotalHeuresByDSDE",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    const { DateStart, DateEnd } = req.query;

    let query;
    let queryParams = [];

    if (DateStart && DateEnd) {
      query =
        "SELECT pon.Matricule, e.FullName, e.TauxHoraire, SEC_TO_TIME(SUM(TIME_TO_SEC(HeuresReelles))) AS TotalHT FROM pointagenormal pon LEFT JOIN employee e ON e.Matricule = pon.Matricule WHERE pon.DateJour BETWEEN ? AND ? GROUP BY pon.Matricule";
      queryParams = [DateStart, DateEnd];
    } else {
      query =
        "SELECT pon.Matricule, e.FullName, e.TauxHoraire, SEC_TO_TIME(SUM(TIME_TO_SEC(HeuresReelles))) AS TotalHT FROM pointagenormal pon LEFT JOIN employee e ON e.Matricule = pon.Matricule GROUP BY pon.Matricule";
    }

    connection.query(query, queryParams, (err, results) => {
      if (!err) {
        const resultsWithPrevisionSalaire = results.map((result) => ({
          ...result,
          PrevisionSalaire: result.TauxHoraire * parseFloat(result.TotalHT),
        }));

        return res.status(200).json(resultsWithPrevisionSalaire);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

//DELETE
router.delete("/DeleteNormal", (req, res, next) => {
  const { Matricule, DateJour } = req.query;

  if (!Matricule || !DateJour) {
    return res.status(400).json({
      message: "Matricule and DateJour are required.",
    });
  }

  const query = "DELETE FROM pointagenormal WHERE Matricule=? AND DateJour=?";
  connection.query(query, [Matricule, DateJour], (err, results) => {
    if (!err) {
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Pointage Normal not found" });
      }
      return res
        .status(200)
        .json({ message: "Pointage Normal deleted successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/exportRapportPointage", auth.authenticateToken, (req, res) => {
  const query =
    "SELECT pon.Matricule, e.FullName, e.TauxHoraire, SEC_TO_TIME(SUM(TIME_TO_SEC(HeuresReelles))) AS TotalHT FROM pointagenormal pon LEFT JOIN employee e ON e.Matricule = pon.Matricule GROUP BY pon.Matricule";

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    // Calculate PrevisionSalaire
    const resultsWithPrevisionSalaire = results.map((result) => ({
      ...result,
      PrevisionSalaire: result.TauxHoraire * parseFloat(result.TotalHT),
    }));

    // Create an Excel workbook and worksheet
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Rapport");

    // Define columns
    worksheet.columns = [
      { header: "Matricule", key: "Matricule" },
      { header: "FullName", key: "FullName" },
      { header: "TauxHoraire", key: "TauxHoraire" },
      { header: "TotalHT", key: "TotalHT" },
      { header: "PrevisionSalaire", key: "PrevisionSalaire" },
    ];

    // Add rows to the worksheet
    resultsWithPrevisionSalaire.forEach((employee) => {
      worksheet.addRow(employee);
    });

    // Write the Excel file to a buffer and send it as a response
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

module.exports = router;
