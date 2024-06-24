const express = require("express");
const connection = require("../connection");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const multer = require("multer");
//add_fiche_contrat

const storagefileContrat = multer.diskStorage({
  destination: (req, file, cb) => {
    const { Matricule } = req.query;
    const uploadPath = path.join(__dirname, "upload", Matricule);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { Matricule } = req.query;
    const fileName = `${Matricule}-Contrat.pdf`;
    cb(null, fileName);
  },
});
const uploadfichecontrat = multer({ storage: storagefileContrat });
//********************************************* */
//add_fiche_poste

const storagefilePoste = multer.diskStorage({
  destination: (req, file, cb) => {
    const { Matricule } = req.query;
    const uploadPath = path.join(__dirname, "upload", Matricule);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { Matricule } = req.query;
    const fileName = `${Matricule}-Poste.pdf`;
    cb(null, fileName);
  },
});
const uploadficheposte = multer({ storage: storagefilePoste });
//********************************************* */

var auth = require("../services/authentication");
var checkRoleRH = require("../services/checkRole");
const PDFDocument = require("pdfkit");
const pdfService = require("../services/pdf-contrat");

//variable_static_entreprise
const globalenr = "GLOBAL ENR";
const secteuractivite = "Consulting";
const siegesocial = "Immeuble Wafa,Avenue De La Bourse,Lac 2";
const delegation = "La Goulette";
const gouvernorat = "Tunis";
const adresseelectronique = "contact@globalenr.com";
const telentreprise = "36 044 033";
const fax = "";
const matfiscal = "000 MA 1799357";
const numafficnss = "-661419-73";
const chefentreprise = "Bilale Chaudhry";
const chefentreprise2 = "Ben Chaabane Med Amine";
const postchef = "Directeur Général";
const telchef = "24 846 245";
const civplettre = "Deux-Cents Dinars";
const civpsalaire = 200;
const currentDate = new Date().toISOString().slice(0, 10);
const lieu = "Tunis";
//variable_static_employee
const dateformation = "";
const dureecontrat = "";

//get All Contrat
router.get(
  "/getAllContrat",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    var query =
      "SELECT co.Matricule, e.FullName, co.TypeContrat, co.Salaire, DATE_FORMAT(co.DateDeb, '%Y-%m-%d') AS DateDeb, DATE_FORMAT(co.DateFin, '%Y-%m-%d') AS DateFin FROM contrat co LEFT JOIN employee e ON co.Matricule = e.Matricule ";

    connection.query(query, (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
//get All Contrat By Matricule
router.get(
  "/getInfoContratByMatricule",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    const coMatriculeQuery = req.query;
    var query =
      "SELECT co.Matricule, e.FullName, co.TypeContrat, co.Salaire, DATE_FORMAT(co.DateDeb, '%Y-%m-%d') AS DateDeb, DATE_FORMAT(co.DateFin, '%Y-%m-%d') AS DateFin FROM contrat co LEFT JOIN employee e ON co.Matricule = e.Matricule WHERE co.Matricule=? ";

    connection.query(query, [coMatriculeQuery.Matricule], (err, results) => {
      if (!err) {
        return res.status(200).json(results);
      } else {
        return res.status(500).json(err);
      }
    });
  }
);
//Update Contrat By Matricule
router.patch(
  "/",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res, next) => {
    const coMatriculeQuery = req.query;
    let coMatriculeBody = req.body;
    var query =
      "update contrat set TypeContrat=?, Salaire=?, DateDeb=?, DateFin=? where Matricule=?";
    connection.query(
      query,
      [
        coMatriculeBody.TypeContrat,
        coMatriculeBody.Salaire,
        coMatriculeBody.DateDeb,
        coMatriculeBody.DateFin,
        coMatriculeQuery.Matricule,
      ],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            return res.status(404).json({ message: " Contrat not found" });
          }
          return res
            .status(200)
            .json({ message: " Contrat updated Successfully" });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);
// Delete Contrat By Matricule
router.delete(
  "/",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  (req, res) => {
    const coMatriculeQuery = req.query;
    var query = "DELETE FROM contrat WHERE Matricule=?";

    connection.query(query, [coMatriculeQuery.Matricule], (err, results) => {
      if (!err) {
        if (results.affectedRows > 0) {
          return res
            .status(200)
            .json({ message: "Contrat deleted successfully" });
        } else {
          return res.status(404).json({ message: "Contrat not found" });
        }
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

//ESPACE to Generate PDF CONTRAT

function fetchEmployeeData(MatriculeQuery) {
  return new Promise((resolve, reject) => {
    const query = `SELECT Matricule, FullName, Cin, DATE_FORMAT(DateNaissance, '%Y-%m-%d') AS DateNaissance, Titre,  LieuNaissance, Adresse, TelPerso, NiveauEtude, Formation, Specialite, Poste  FROM employee WHERE Matricule = ?`;
    connection.query(query, [MatriculeQuery], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}
function fetchContratData(MatriculeQuery) {
  return new Promise((resolve, reject) => {
    const query = `SELECT Matricule, Salaire, DATE_FORMAT(DateDeb, '%Y-%m-%d') AS DateDeb,  DATE_FORMAT(DateFin, '%Y-%m-%d') AS DateFin FROM contrat WHERE Matricule = ?`;
    connection.query(query, [MatriculeQuery], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}
function fetchInfobancairesData(MatriculeQuery) {
  return new Promise((resolve, reject) => {
    const query = `SELECT Matricule, Banque, Rib FROM infobancaires WHERE Matricule = ?`;
    connection.query(query, [MatriculeQuery], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}

router.post("/CIVPcontratPDFDynamicSaveFolder", async (req, res, next) => {
  try {
    const MatriculeQuery = req.query.Matricule;

    const [employeeData, contratData, infobancairesData] = await Promise.all([
      fetchEmployeeData(MatriculeQuery),
      fetchContratData(MatriculeQuery),
      fetchInfobancairesData(MatriculeQuery),
    ]);

    const contratDataCombined = {
      ...employeeData,
      ...contratData,
      ...infobancairesData,
      //info_entreprise_static
      GlobalENR: globalenr,
      SecteurActivite: secteuractivite,
      SiegeSocial: siegesocial,
      Delegation: delegation,
      Gouvernorat: gouvernorat,
      AdresseElectronique: adresseelectronique,
      TelEntreprise: telentreprise,
      Fax: fax,
      MatFiscal: matfiscal,
      NumAffiCNSS: numafficnss,
      ChefEntreprise: chefentreprise,
      ChefEntreprise2: chefentreprise2,
      PostChef: postchef,
      TelChef: telchef,
      CIVPLettre: civplettre,
      CIVPSalaire: civpsalaire,
      Lieu: lieu,
      DateJour: currentDate,
      //info_Employee_static
      DateFormation: dateformation,
      DureeContrat: dureecontrat,
    };

    const pdfChunks = [];
    pdfService.buildPDFCIVP(
      async (chunk) => {
        pdfChunks.push(chunk);
      },
      async () => {
        try {
          const pdfBuffer = Buffer.concat(pdfChunks);
          const uploadDirectory = path.join(
            __dirname,
            "upload",
            MatriculeQuery
          );
          const filename = `${MatriculeQuery}-Contrat.pdf`;
          const filePath = path.join(uploadDirectory, filename);

          if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
          }

          fs.writeFileSync(filePath, pdfBuffer);

          res.status(200).send(filePath);
        } catch (error) {
          console.error("Error saving PDF to directory:", error);
          res.status(500).send("Internal Server Error");
        }
      },
      (error) => {
        console.error("Error generating PDF:", error);
        res.status(500).send("Internal Server Error");
      },
      contratDataCombined
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Bad Request");
  }
});

router.post("/CDIcontratPDFDynamicSaveFolder", async (req, res, next) => {
  try {
    const MatriculeQuery = req.query.Matricule;

    const [employeeData, contratData, infobancairesData] = await Promise.all([
      fetchEmployeeData(MatriculeQuery),
      fetchContratData(MatriculeQuery),
      fetchInfobancairesData(MatriculeQuery),
    ]);

    const contratDataCombined = {
      ...employeeData,
      ...contratData,
      ...infobancairesData,
      DateJour: currentDate,
      Lieu: lieu,
    };

    const pdfChunks = [];
    pdfService.buildPDFCDI(
      async (chunk) => {
        pdfChunks.push(chunk);
      },
      async () => {
        try {
          const pdfBuffer = Buffer.concat(pdfChunks);
          const uploadDirectory = path.join(
            __dirname,
            "upload",
            MatriculeQuery
          );
          const filename = `${MatriculeQuery}-Contrat.pdf`;
          const filePath = path.join(uploadDirectory, filename);

          if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
          }

          fs.writeFileSync(filePath, pdfBuffer);

          res.status(200).send(filePath);
        } catch (error) {
          console.error("Error saving PDF to directory:", error);
          res.status(500).send("Internal Server Error");
        }
      },
      (error) => {
        console.error("Error generating PDF:", error);
        res.status(500).send("Internal Server Error");
      },
      contratDataCombined
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Bad Request");
  }
});

router.post("/CDDcontratPDFDynamicSaveFolder", async (req, res, next) => {
  try {
    const MatriculeQuery = req.query.Matricule;

    const [employeeData, contratData, infobancairesData] = await Promise.all([
      fetchEmployeeData(MatriculeQuery),
      fetchContratData(MatriculeQuery),
      fetchInfobancairesData(MatriculeQuery),
    ]);

    const contratDataCombined = {
      ...employeeData,
      ...contratData,
      ...infobancairesData,
      DateJour: currentDate,
      Lieu: lieu,
    };

    const pdfChunks = [];
    pdfService.buildPDFCDD(
      async (chunk) => {
        pdfChunks.push(chunk);
      },
      async () => {
        try {
          const pdfBuffer = Buffer.concat(pdfChunks);
          const uploadDirectory = path.join(
            __dirname,
            "upload",
            MatriculeQuery
          );
          const filename = `${MatriculeQuery}-Contrat.pdf`;
          const filePath = path.join(uploadDirectory, filename);

          if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
          }

          fs.writeFileSync(filePath, pdfBuffer);

          res.status(200).send(filePath);
        } catch (error) {
          console.error("Error saving PDF to directory:", error);
          res.status(500).send("Internal Server Error");
        }
      },
      (error) => {
        console.error("Error generating PDF:", error);
        res.status(500).send("Internal Server Error");
      },
      contratDataCombined
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Bad Request");
  }
});

router.post("/NoDeclarecontratPDFDynamicSaveFolder", async (req, res, next) => {
  try {
    const MatriculeQuery = req.query.Matricule;
    const uploadDirectory = path.join(__dirname, "upload", MatriculeQuery);

    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    res.status(200).send("Directory created successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//download_fiche
router.get("/downloadPDF", (req, res) => {
  const { Matricule } = req.query;
  const fileName = `${Matricule}-Contrat.pdf`;
  const filePath = path.join(__dirname, "upload", Matricule, fileName);
  try {
    if (fs.existsSync(filePath)) {
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error("Error downloading PDF:", err);
          res.status(500).send("Internal Server Error");
        }
      });
    } else {
      res.status(404).send("File Not Found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/downloadFichePostePDF", (req, res) => {
  const { Matricule } = req.query;
  const fileName = `${Matricule}-Poste.pdf`;
  const filePath = path.join(__dirname, "upload", Matricule, fileName);

  try {
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Disposition", "inline; filename=" + fileName);
      res.setHeader("Content-Type", "application/pdf");

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      res.status(404).send("File Not Found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//upload_fiche
//contrat_fiche_upload
router.post(
  "/uploadFicheContratPDF",
  uploadfichecontrat.single("file"),
  (req, res) => {
    res.status(200).send("File Contrat uploaded successfully");
  }
);
//poste_fiche_upload
router.post(
  "/uploadFichePostePDF",
  uploadficheposte.single("file"),
  (req, res) => {
    res.status(200).send("File Contrat uploaded successfully");
  }
);

module.exports = router;
