const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateTransactionPDF(transaction) {
  const filePath = path.join(__dirname, `receipt-${transaction.id}.pdf`);
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Backend Ledger", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Transaction Receipt`);
  doc.moveDown();

  doc.text(`Transaction ID: ${transaction.id}`);
  doc.text(`Amount: $${transaction.amount}`);
  doc.text(`To Account: ****${transaction.toAccount.slice(-4)}`);
  doc.text(`Date: ${new Date().toLocaleString()}`);

  doc.end();

  return filePath;
}

module.exports = generateTransactionPDF;
