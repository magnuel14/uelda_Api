const handlebars = require("handlebars");
let fs = require('fs');
const htmlToPdf = require('html-pdf');
const { PDFDocument  } = require('pdf-lib');

const pdfGenerator = {};

pdfGenerator.matriculaReport = async () => {
  //Get template
  const path = "./public/pdf_templates/certificado_matricula.html";
  let html = file(path);
  let template = handlebars.compile(html);

  //Fill data into html template
  let htmlCompiled = template({
    name: "Nombre de estudiante",
    date: textDate()
  });

  let options = {
    format: "A4",
    orientation: "landscape",
    header: {
      height: "3mm",
    },
    footer: {
      height: "3mm",
    },
  };

  const outputPath = './reporte.pdf'; //Update folder direction
  await generateModifiedPdf(htmlCompiled, options, outputPath)
    .then((outputPath) => {
      console.log(`PDF generated successfully. Output file path: ${outputPath}`);
    })
    .catch((error) => {
      console.error(error);
    });

};

pdfGenerator.calificacionesReport = async () => {
  //Get template
  const path = "./public/pdf_templates/calificaciones.html";
  let html = file(path);
  let template = handlebars.compile(html);

  //Fill data into html template
  let htmlCompiled = template({
    name: "Nombre de estudiante",
    date: textDate()
  });

  let options = {
    format: "A4",
    orientation: "landscape",
    header: {
      height: "2mm",
    },
    footer: {
      height: "2mm",
    },
  };

  const outputPath = './calificaciones.pdf'; //Update folder direction
  await generateModifiedPdf(htmlCompiled, options, outputPath)
    .then((outputPath) => {
      console.log(`PDF generated successfully. Output file path: ${outputPath}`);
    })
    .catch((error) => {
      console.error(error);
    });

};

function file(path) {
  try {
    const data = fs.readFileSync(path, "utf8");
    return data;
  } catch (err) {
      console.log(err);
    return 0;
  }
}

const generateModifiedPdf = async (html, options, outputPath) => {
  return new Promise((resolve, reject) => {
    htmlToPdf.create(html, options).toFile(outputPath, async (err, res) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      const pdfBytes = fs.readFileSync(outputPath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const modifiedPdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, modifiedPdfBytes);
      resolve(outputPath);
    });
  });
};

function textDate() {
  let date = new Date()
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

module.exports = pdfGenerator;
