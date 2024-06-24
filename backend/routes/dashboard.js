const express = require("express");
const connection = require("../connection");
const router = express.Router();
const auth = require("../services/authentication");
const checkRoleRH = require("../services/checkRole");

require("dotenv").config();
//API//
router.get(
  "/",
  auth.authenticateToken,
  checkRoleRH.checkRoleRH,
  async (req, res) => {
    try {
      const today = new Date();
      const currentYear = today.getFullYear();
      const NbrTotalDepartement = "6";
      const NbrTotalTitre = "21";
      const NbrTotalEmployees = await getCount("employee");
      const NbrTotalEmployeesInactive = await getCount(
        "employee",
        "Status",
        "0"
      );
      const NbrTotalEmployeesGLOBALENR = await getCount(
        "employee",
        "Activite",
        "GLOBALENR"
      );
      const NbrTotalEmployeesAUTRE = await getCount(
        "employee",
        "Activite",
        "AUTRE"
      );

      const NbrTotalTeamLeader = await getCount(
        "employee",
        "Poste",
        "Teamleader"
      );
      const NbrTotalManager = await getCount("employee", "Poste", "Manager");
      const NbrTotalResponsable = await getCount(
        "employee",
        "Poste",
        "Responsable"
      );
      const NbrTotalCollaborateur = await getCount(
        "employee",
        "Poste",
        "Collaborateur"
      );
      const NbrTotalStagiaire = await getCount(
        "employee",
        "Departement",
        "Stagiaire"
      );

      const NbrTotalCelib = await getCount(
        "employee",
        "SituationFamiliale",
        "Célib"
      );
      const NbrTotalMariee = await getCount(
        "employee",
        "SituationFamiliale",
        "Mariée"
      );
      const NbrTotalChefDeFamille = await getCount(
        "employee",
        "ChefFamille",
        "1"
      );

      const NbrTotalContratCIVP = await getCount(
        "contrat",
        "TypeContrat",
        "CIVP"
      );
      const NbrTotalContratCIVP2 = await getCount(
        "contrat",
        "TypeContrat",
        "CIVP 2"
      );
      const NbrTotalContratCDI = await getCount(
        "contrat",
        "TypeContrat",
        "CDI"
      );
      const NbrTotalContratCDD = await getCount(
        "contrat",
        "TypeContrat",
        "CDD"
      );
      const NbrTotalContratNONDECLARE = await getCount(
        "contrat",
        "TypeContrat",
        "Non Déclaré"
      );

      const NbrTotalGenreM = await getCount("employee", "Genre", "M");
      const NbrTotalGenreF = await getCount("employee", "Genre", "F");

      const NbrTotalDepartementSI = await getCount(
        "employee",
        "Departement",
        "Systèmes Informatiques"
      );
      const NbrTotalDepartementRH = await getCount(
        "employee",
        "Departement",
        "Ressources Humaines"
      );
      const NbrTotalDepartementMQHSES = await getCount(
        "employee",
        "Departement",
        "MQHSES"
      );
      const NbrTotalDepartementBO = await getCount(
        "employee",
        "Departement",
        "Back Office"
      );
      const NbrTotalDepartementCF = await getCount(
        "employee",
        "Departement",
        "Comptabilité et Finance"
      );
      const NbrTotalDepartementT = await getCount(
        "employee",
        "Departement",
        "Technique"
      );
      const NbrTotalDepartementSG = await getCount(
        "employee",
        "Departement",
        "Services Généraux"
      );

      const NbrTotalNiveauEtudeInfBAC = await getCount(
        "employee",
        "NiveauEtude",
        "INF BAC"
      );
      const NbrTotalNiveauEtudeBAC = await getCount(
        "employee",
        "NiveauEtude",
        "BAC"
      );
      const NbrTotalNiveauEtudeSupBAC = await getCount(
        "employee",
        "NiveauEtude",
        "SUP BAC"
      );
      const NbrTotalNiveauEtudeBACplus3 = await getCount(
        "employee",
        "NiveauEtude",
        "BAC+3"
      );
      const NbrTotalNiveauEtudeBACplus5 = await getCount(
        "employee",
        "NiveauEtude",
        "BAC+5"
      );
      const NbrTotalNiveauEtudeSupBACplus5 = await getCount(
        "employee",
        "NiveauEtude",
        "SUP BAC+5"
      );

      const age21_25 = await getCountByAgeRange(
        "employee",
        21,
        25,
        currentYear
      );
      const age26_30 = await getCountByAgeRange(
        "employee",
        26,
        30,
        currentYear
      );
      const age31_35 = await getCountByAgeRange(
        "employee",
        31,
        35,
        currentYear
      );
      const age36_40 = await getCountByAgeRange(
        "employee",
        36,
        40,
        currentYear
      );
      const age41_45 = await getCountByAgeRange(
        "employee",
        41,
        45,
        currentYear
      );
      const age46_50 = await getCountByAgeRange(
        "employee",
        46,
        50,
        currentYear
      );
      const age50Plus = await getCountByAgeRange(
        "employee",
        50,
        80,
        currentYear
      );
      const TotalSalaires = await getTotalSalaires();
      const { MinSalaire, MaxSalaire } = await getMinMaxSalaires();

      const NbrTotalTitreddp = await getCount(
        "employee",
        "Titre",
        "Directeur des productions"
      );
      const NbrTotalTitreIEE = await getCount(
        "employee",
        "Titre",
        "Ingénieur Efficacité énergétique"
      );
      const NbrTotalTitreDT = await getCount(
        "employee",
        "Titre",
        "Directeur Technique"
      );

      const NbrTotalTitreRAMQHSE = await getCount(
        "employee",
        "Titre",
        "Responsable Administratif && Management QHSE"
      );
      const NbrTotalTitreDDRH = await getCount(
        "employee",
        "Titre",
        "Directrice Des Ressources Humaines"
      );
      const NbrTotalTitreDev = await getCount(
        "employee",
        "Titre",
        "Développeur"
      );
      const NbrTotalTitreMBO = await getCount(
        "employee",
        "Titre",
        "Manager BACK OFFICE"
      );
      const NbrTotalTitreCF = await getCount(
        "employee",
        "Titre",
        "Comptable && Finance"
      );
      const NbrTotalTitreTDS = await getCount(
        "employee",
        "Titre",
        "Technicienne de surface"
      );
      const NbrTotalTitreCoursier = await getCount(
        "employee",
        "Titre",
        "COURSIER"
      );
      const NbrTotalTitreCM = await getCount(
        "employee",
        "Titre",
        "Community Manager"
      );
      const NbrTotalTitreAA = await getCount(
        "employee",
        "Titre",
        "Assistante Administrative"
      );
      const NbrTotalTitreDA = await getCount(
        "employee",
        "Titre",
        "Data Analyst"
      );
      const NbrTotalTitreCCCEE = await getCount(
        "employee",
        "Titre",
        "Chargée Conformité CEE"
      );
      const NbrTotalTitreCPS = await getCount(
        "employee",
        "Titre",
        "Chargé Paie && Saisie"
      );
      const NbrTotalTitreRCF = await getCount(
        "employee",
        "Titre",
        "Responsable Comptable && Financier"
      );
      const NbrTotalTitreCCS = await getCount(
        "employee",
        "Titre",
        "Chargée Contrôle && Statistique"
      );
      const NbrTotalTitreCSG = await getCount(
        "employee",
        "Titre",
        "Chargée Service Généraux"
      );
      const NbrTotalTitreCRH = await getCount(
        "employee",
        "Titre",
        "Chargée Ressources Humaines"
      );
      const NbrTotalTitreGerant = await getCount("employee", "Titre", "Gérant");
      const NbrTotalTitreDG = await getCount(
        "employee",
        "Titre",
        "Directeur Général"
      );
      const NbrTotalTitreResponsable = await getCount(
        "employee",
        "Titre",
        "Responsable"
      );
      const NbrTotalTitreManager = await getCount(
        "employee",
        "Titre",
        "Manager"
      );
      const NbrTotalTitreTeamleader = await getCount(
        "employee",
        "Titre",
        "Teamleader"
      );
      const NbrTotalTitreStagiare = await getCount(
        "employee",
        "Titre",
        "Stagiaire"
      );

      const NbrTotalTitreADD = await getCount(
        "employee",
        "Titre",
        "Assistante De Direction"
      );
      //Assurance
      const NbrTotalAssurance = await getCount("employee");
      const NbrTotalAssuranceNotExiste = await getCount(
        "employee",
        "Assurance",
        "0"
      );
      const NbrTotalAssuranceExiste =
        NbrTotalAssurance - NbrTotalAssuranceNotExiste;

      //TITRE
      const nbremploy = NbrTotalEmployeesGLOBALENR - NbrTotalEmployeesInactive;

      res.json({
        NbrTotalEmployees,
        NbrTotalEmployeesGLOBALENR,
        NbrTotalEmployeesAUTRE,
        NbrTotalEmployeesInactive,
        nbremploy,

        //PAR POSTE
        NbrTotalTeamLeader,
        NbrTotalManager,
        NbrTotalResponsable,
        NbrTotalCollaborateur,
        NbrTotalStagiaire,
        //NbrTotalFemmeDeMenage,
        //NbrTotalCourssier,

        //PAR SITUATION
        NbrTotalCelib,
        NbrTotalMariee,
        NbrTotalChefDeFamille,

        //PAR TYPE_CONTRAT
        NbrTotalContratCIVP,
        NbrTotalContratCIVP2,
        NbrTotalContratCDI,
        NbrTotalContratCDD,
        NbrTotalContratNONDECLARE,

        //PAR GENRE
        NbrTotalGenreM,
        NbrTotalGenreF,

        //PAR DEPARTEMENT
        NbrTotalDepartement,
        NbrTotalDepartementSI,
        NbrTotalDepartementRH,
        NbrTotalDepartementMQHSES,
        NbrTotalDepartementBO,
        NbrTotalDepartementCF,
        NbrTotalDepartementT,
        NbrTotalDepartementSG,

        //PAR NIVEAUETUDE
        NbrTotalNiveauEtudeInfBAC,
        NbrTotalNiveauEtudeBAC,
        NbrTotalNiveauEtudeSupBAC,
        NbrTotalNiveauEtudeBACplus3,
        NbrTotalNiveauEtudeBACplus5,
        NbrTotalNiveauEtudeSupBACplus5,

        //PAR AGE
        age21_25,
        age26_30,
        age31_35,
        age36_40,
        age41_45,
        age46_50,
        age50Plus,

        //PAR SALAIRE
        TotalSalaires,
        MaxSalaire,
        MinSalaire,

        //PAR TITRE

        //nbr poste
        NbrTotalTitre,
        //
        NbrTotalTitreddp,
        NbrTotalTitreIEE,
        NbrTotalTitreDT,
        NbrTotalTitreRAMQHSE,
        NbrTotalTitreDDRH,
        NbrTotalTitreDev,
        NbrTotalTitreMBO,
        NbrTotalTitreCF,
        NbrTotalTitreTDS,
        NbrTotalTitreCoursier,
        NbrTotalTitreCM,
        NbrTotalTitreAA,
        NbrTotalTitreDA,
        NbrTotalTitreCCCEE,
        NbrTotalTitreCPS,
        NbrTotalTitreRCF,
        NbrTotalTitreCCS,
        NbrTotalTitreCSG,
        NbrTotalTitreCRH,
        NbrTotalTitreGerant,
        NbrTotalTitreDG,
        NbrTotalTitreResponsable,
        NbrTotalTitreManager,
        NbrTotalTitreTeamleader,
        NbrTotalTitreStagiare,
        NbrTotalTitreADD,

        //Assurance
        NbrTotalAssurance,
        NbrTotalAssuranceExiste,
        NbrTotalAssuranceNotExiste,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

//FN//
function getCount(table, column = "", value = "") {
  return new Promise((resolve, reject) => {
    let query;
    if (column && value) {
      query = `SELECT COUNT(*) AS count FROM ${table} co LEFT JOIN employee e ON e.Matricule = co.Matricule WHERE e.Status = 1 AND e.Activite = "GLOBALENR" AND co.${column}='${value}'`;
    } else {
      query = `SELECT COUNT(*) AS count FROM ${table} co LEFT JOIN employee e ON e.Matricule = co.Matricule WHERE e.Status = 1 AND e.Activite = "GLOBALENR"`;
    }
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count);
      }
    });
  });
}
function getCountByAgeRange(table, minAge, maxAge, currentYear) {
  return new Promise((resolve, reject) => {
    const minBirthYear = currentYear - maxAge - 1;
    const maxBirthYear = currentYear - minAge;

    const query = `SELECT COUNT(*) AS count FROM ${table} co
      LEFT JOIN employee e ON e.Matricule = co.Matricule
      WHERE e.Status = 1 AND e.Activite = "GLOBALENR"
      AND YEAR(co.DateNaissance) BETWEEN ${minBirthYear} AND ${maxBirthYear}`;

    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].count);
      }
    });
  });
}

async function getTotalSalaires() {
  return new Promise((resolve, reject) => {
    const query =
      `SELECT SUM(co.Salaire) AS TotalSalaires ` +
      `FROM contrat co ` +
      `LEFT JOIN employee e ON e.Matricule = co.Matricule ` +
      `WHERE e.Status = 1 AND e.Activite = "GLOBALENR"`;
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].TotalSalaires || 0);
      }
    });
  });
}
async function getMinMaxSalaires() {
  return new Promise((resolve, reject) => {
    const query =
      `SELECT MIN(co.Salaire) AS MinSalaire, MAX(co.Salaire) AS MaxSalaire ` +
      `FROM contrat co ` +
      `LEFT JOIN employee e ON e.Matricule = co.Matricule ` +
      `WHERE e.Status = 1 AND e.Activite = "GLOBALENR"`;
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          MinSalaire: results[0].MinSalaire || 0,
          MaxSalaire: results[0].MaxSalaire || 0,
        });
      }
    });
  });
}

module.exports = router;
