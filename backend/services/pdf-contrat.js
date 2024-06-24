const PDFDocument = require("pdfkit");
const fs = require("fs");

//CDI function
function buildPDFCDI(
  dataCallback,
  endCallback,
  errorCallback,
  contratDataCombined
) {
  try {
    const doc = new PDFDocument({ bufferPages: true, font: "Courier-Bold" });

    doc.on("data", dataCallback);
    doc.on("end", endCallback);

    const imagePath1 = "services/CDI-MODEL/CONTRAT_MODEL CDI P1.jpg";
    const imageBuffer1 = fs.readFileSync(imagePath1);
    doc.image(imageBuffer1, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    const textSize = 14;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const textCenterX = pageWidth;
    const textMarginY = pageHeight / 2;
    let textY = textMarginY;

    function addText(text, x, y) {
      doc.fontSize(textSize).text(text, x, y, { align: "center" });
    }

    addText(`${contratDataCombined.FullName}`, textCenterX - 775, 295);
    addText(`${contratDataCombined.DateNaissance}`, textCenterX - 410, 295);
    addText(`${contratDataCombined.LieuNaissance}`, textCenterX - 180, 295);
    addText(`${contratDataCombined.Cin}`, textCenterX - 780, 309);
    addText(`${contratDataCombined.DateNaissance}`, textCenterX - 320, 309);
    addText(`${contratDataCombined.LieuNaissance}`, textCenterX - 950, 320);
    addText(`${contratDataCombined.Poste}`, textCenterX - 950, 447);
    addText(`${contratDataCombined.FullName}`, textCenterX - 500, 447);
    addText(`${contratDataCombined.Titre}`, textCenterX - 880, 460);
    addText(`${contratDataCombined.FullName}`, textCenterX - 250, 560);
    addText(`${contratDataCombined.FullName}`, textCenterX - 880, 585);
    addText(`${contratDataCombined.FullName}`, textCenterX - 740, 611);

    doc.addPage();

    const imagePath2 = "services/CDI-MODEL/CONTRAT_MODEL CDI P2.jpg";
    const imageBuffer2 = fs.readFileSync(imagePath2);
    doc.image(imageBuffer2, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    textY = textMarginY;

    addText(`${contratDataCombined.FullName}`, textCenterX - 510, 560);
    addText(`${contratDataCombined.FullName}`, textCenterX - 580, 585);
    addText(`${contratDataCombined.FullName}`, textCenterX - 350, 623);
    addText(`${contratDataCombined.FullName}`, textCenterX - 500, 674);

    doc.addPage();

    const imagePath3 = "services/CDI-MODEL/CONTRAT_MODEL CDI P3.jpg";
    const imageBuffer3 = fs.readFileSync(imagePath3);
    doc.image(imageBuffer3, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    textY = textMarginY;

    addText(`${contratDataCombined.FullName}`, textCenterX - 660, 143);
    addText(`${contratDataCombined.FullName}`, textCenterX - 870, 181);
    addText(`${contratDataCombined.FullName}`, textCenterX - 950, 206);
    addText(`${contratDataCombined.Salaire}`, textCenterX - 550, 358);
    addText(`${contratDataCombined.Salaire}`, textCenterX - 220, 358);

    doc.addPage();

    const imagePath4 = "services/CDI-MODEL/CONTRAT_MODEL CDI P4.jpg";
    const imageBuffer4 = fs.readFileSync(imagePath4);
    doc.image(imageBuffer4, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    textY = textMarginY;

    addText(`${contratDataCombined.FullName}`, textCenterX - 950, 143);
    addText(`${contratDataCombined.FullName}`, textCenterX - 620, 485);
    addText(`${contratDataCombined.FullName}`, textCenterX - 560, 522);
    addText(`${contratDataCombined.FullName}`, textCenterX - 360, 573);
    addText(`${contratDataCombined.FullName}`, textCenterX - 860, 598);
    addText(`${contratDataCombined.FullName}`, textCenterX - 770, 637);

    doc.addPage();

    const imagePath5 = "services/CDI-MODEL/CONTRAT_MODEL CDI P5.jpg";
    const imageBuffer5 = fs.readFileSync(imagePath5);
    doc.image(imageBuffer5, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    textY = textMarginY;

    addText(`${contratDataCombined.FullName}`, textCenterX - 200, 308);
    addText(`${contratDataCombined.FullName}`, textCenterX - 640, 346);
    addText(`${contratDataCombined.FullName}`, textCenterX - 620, 421);
    addText(`${contratDataCombined.DateJour}`, textCenterX - 820, 535);

    doc.end();
  } catch (error) {
    errorCallback(error);
  }
}

//CIVP function
function buildPDFCIVP(
  dataCallback,
  endCallback,
  errorCallback,
  contratDataCombined
) {
  try {
    const doc = new PDFDocument({ bufferPages: true, font: "Courier-Bold" });

    doc.on("data", dataCallback);
    doc.on("end", endCallback);

    const imagePath1 = "services/CIVP-MODEL/CONTRAT CIVP MODEL P1.jpg";
    const imageBuffer1 = fs.readFileSync(imagePath1);
    doc.image(imageBuffer1, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    const textSize = 10;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const textCenterX = pageWidth;
    const textMarginY = pageHeight / 2;
    let textY = textMarginY;

    function addText(text, x, y) {
      doc.fontSize(textSize).text(text, x, y, { align: "center" });
    }

    //Generated_Auto_By_Info_Entreprise
    addText(`${contratDataCombined.GlobalENR}`, textCenterX - 575, 195);

    addText(`${contratDataCombined.SecteurActivite}`, textCenterX - 575, 207);

    addText(`${contratDataCombined.SiegeSocial}`, textCenterX - 730, 219);
    addText(`${contratDataCombined.Delegation}`, textCenterX - 310, 219);
    addText(`${contratDataCombined.Gouvernorat}`, textCenterX - 102, 219);

    addText(
      `${contratDataCombined.AdresseElectronique}`,
      textCenterX - 765,
      231
    );
    addText(`${contratDataCombined.TelEntreprise}`, textCenterX - 500, 231);
    addText(`${contratDataCombined.Fax}`, textCenterX - 200, 231);

    addText(`${contratDataCombined.MatFiscal}`, textCenterX - 765, 242);
    addText(`${contratDataCombined.NumAffiCNSS}`, textCenterX - 200, 242);

    addText(`${contratDataCombined.ChefEntreprise}`, textCenterX - 765, 254);

    addText(`${contratDataCombined.ChefEntreprise2}`, textCenterX - 660, 265);

    addText(`${contratDataCombined.PostChef}`, textCenterX - 775, 277);
    addText(`${contratDataCombined.TelChef}`, textCenterX - 200, 277);

    //Generated_Auto_By_Info_Employee
    addText(`${contratDataCombined.FullName}`, textCenterX - 775, 335);

    addText(`${contratDataCombined.DateNaissance}`, textCenterX - 775, 347);
    addText(`${contratDataCombined.LieuNaissance}`, textCenterX - 650, 347);
    addText(`${contratDataCombined.Cin}`, textCenterX - 180, 346);

    addText(`${contratDataCombined.Adresse}`, textCenterX - 580, 358);
    addText(`${contratDataCombined.TelPerso}`, textCenterX - 170, 358);

    // addText(`${contratDataCombined.EmailPerso}`, textCenterX - 740, 369);

    addText(`${contratDataCombined.NiveauEtude}`, textCenterX - 740, 381);

    addText(`${contratDataCombined.Formation}`, textCenterX - 900, 393);
    addText(`${contratDataCombined.Specialite}`, textCenterX - 580, 393);
    addText(`${contratDataCombined.DateFormation}`, textCenterX - 102, 394);

    addText(`${contratDataCombined.Rib}`, textCenterX - 780, 406);
    addText(`${contratDataCombined.Banque}`, textCenterX - 140, 406);

    addText(`${contratDataCombined.Poste}`, textCenterX - 620, 506);

    addText(`${contratDataCombined.FullName}`, textCenterX - 670, 516);
    addText(`${contratDataCombined.Titre}`, textCenterX - 780, 526);

    addText(`${contratDataCombined.GlobalENR}`, textCenterX - 270, 537);

    addText(`${contratDataCombined.DureeContrat}`, textCenterX - 680, 568);
    addText(`${contratDataCombined.DateDeb}`, textCenterX - 430, 568);
    addText(`${contratDataCombined.DateFin}`, textCenterX - 230, 568);

    addText(`${contratDataCombined.CIVPLettre}`, textCenterX - 880, 696);
    addText(`${contratDataCombined.CIVPSalaire}`, textCenterX - 500, 696);

    //addText(`${contratDataCombined.SalaireLettre}`, textCenterX - 180, 295);
    addText(`${contratDataCombined.Salaire}`, textCenterX - 280, 708);

    doc.addPage();

    const imagePath2 = "services/CIVP-MODEL/CONTRAT CIVP MODEL P2.jpg";
    const imageBuffer2 = fs.readFileSync(imagePath2);
    doc.image(imageBuffer2, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    textY = textMarginY;

    addText(`${contratDataCombined.DateJour}`, textCenterX - 350, 616);
    addText(`${contratDataCombined.Lieu}`, textCenterX - 550, 616);

    doc.end();
  } catch (error) {
    errorCallback(error);
  }
}

//CDI function
function buildPDFCDD(
  dataCallback,
  endCallback,
  errorCallback,
  contratDataCombined
) {
  try {
    const doc = new PDFDocument({ bufferPages: true, font: "Courier-Bold" });

    doc.on("data", dataCallback);
    doc.on("end", endCallback);

    const imagePath1 = "services/CDD-MODEL/CONTRAT_MODEL_CDD_P1.jpg";
    const imageBuffer1 = fs.readFileSync(imagePath1);
    doc.image(imageBuffer1, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    const textSize = 10;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const textCenterX = pageWidth;
    const textMarginY = pageHeight / 2;
    let textY = textMarginY;

    function addText(text, x, y) {
      doc.fontSize(textSize).text(text, x, y, { align: "center" });
    }

    addText(`${contratDataCombined.FullName}`, textCenterX - 750, 297);
    addText(`${contratDataCombined.DateNaissance}`, textCenterX - 410, 297);
    addText(`${contratDataCombined.LieuNaissance}`, textCenterX - 950, 310);
    addText(`${contratDataCombined.Cin}`, textCenterX - 460, 310);
    //addText(`${contratDataCombined.DateNaissance}`, textCenterX - 320, 401);
    addText(`${contratDataCombined.Lieu}`, textCenterX - 950, 322);
    addText(`${contratDataCombined.Lieu}`, textCenterX - 460, 322);
    addText(`${contratDataCombined.Poste}`, textCenterX - 920, 436);
    addText(`${contratDataCombined.FullName}`, textCenterX - 420, 436);
    addText(`${contratDataCombined.Titre}`, textCenterX - 740, 449);
    addText(`${contratDataCombined.FullName}`, textCenterX - 240, 550);
    addText(`${contratDataCombined.FullName}`, textCenterX - 840, 575);
    addText(`${contratDataCombined.FullName}`, textCenterX - 720, 600);

    doc.addPage();

    const imagePath2 = "services/CDD-MODEL/CONTRAT_MODEL_CDD_P2.jpg";
    const imageBuffer2 = fs.readFileSync(imagePath2);
    doc.image(imageBuffer2, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    textY = textMarginY;

    addText(`${contratDataCombined.FullName}`, textCenterX - 470, 538);
    addText(`${contratDataCombined.FullName}`, textCenterX - 560, 562);
    addText(`${contratDataCombined.FullName}`, textCenterX - 330, 600);
    addText(`${contratDataCombined.FullName}`, textCenterX - 480, 651);

    doc.addPage();

    const imagePath3 = "services/CDD-MODEL/CONTRAT_MODEL_CDD_P3.jpg";
    const imageBuffer3 = fs.readFileSync(imagePath3);
    doc.image(imageBuffer3, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    textY = textMarginY;

    addText(`${contratDataCombined.FullName}`, textCenterX - 640, 145);
    addText(`${contratDataCombined.FullName}`, textCenterX - 840, 183);
    addText(`${contratDataCombined.FullName}`, textCenterX - 930, 208);
    addText(`${contratDataCombined.Salaire}`, textCenterX - 550, 360);
    addText(`${contratDataCombined.Salaire}`, textCenterX - 220, 360);

    doc.addPage();

    const imagePath4 = "services/CDD-MODEL/CONTRAT_MODEL_CDD_P4.jpg";
    const imageBuffer4 = fs.readFileSync(imagePath4);
    doc.image(imageBuffer4, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    textY = textMarginY;

    addText(`${contratDataCombined.FullName}`, textCenterX - 930, 144);
    addText(`${contratDataCombined.FullName}`, textCenterX - 600, 487);
    addText(`${contratDataCombined.FullName}`, textCenterX - 520, 524);
    addText(`${contratDataCombined.FullName}`, textCenterX - 340, 575);
    addText(`${contratDataCombined.FullName}`, textCenterX - 840, 600);
    addText(`${contratDataCombined.FullName}`, textCenterX - 740, 638);

    doc.addPage();

    const imagePath5 = "services/CDD-MODEL/CONTRAT_MODEL_CDD_P5.jpg";
    const imageBuffer5 = fs.readFileSync(imagePath5);
    doc.image(imageBuffer5, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    textY = textMarginY;

    addText(`${contratDataCombined.FullName}`, textCenterX - 160, 310);
    addText(`${contratDataCombined.FullName}`, textCenterX - 630, 347);
    addText(`${contratDataCombined.FullName}`, textCenterX - 610, 423);
    addText(`${contratDataCombined.DateJour}`, textCenterX - 820, 537);

    doc.end();
  } catch (error) {
    errorCallback(error);
  }
}

module.exports = { buildPDFCIVP, buildPDFCDI, buildPDFCDD };
