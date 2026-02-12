const nodemailer = require("nodemailer");
const sendEmail = require("../config/sendEmail");
const generateEmailTemplate = require("../config/emailTemplate");
const generateTransactionPDF = require("../config/generateReceipt");

/**- transporter's work is to connect with SMTP server */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger – Account Successfully Created";

  const content = `
    <p>Dear ${name},</p>

    <p>We are pleased to inform you that your Backend Ledger account has been successfully created.</p>

    <p>You can now securely access your dashboard to manage transactions, monitor account activity, and utilize our financial services platform.</p>

    <p>If you did not initiate this registration, please contact our support team immediately.</p>

    <p>We look forward to serving you with secure and reliable financial solutions.</p>

    <p>Warm regards,<br><strong>Backend Ledger Team</strong></p>
  `;

  const html = generateEmailTemplate({
    title: "Welcome to Backend Ledger",
    content,
  });

  await sendEmail(userEmail, subject, "", html);
}

async function sendTransactionFailureEmail(
  userEmail,
  name,
  amount,
  toAccount,
  transactionId,
) {
  const formattedDate = new Date().toLocaleString();
  const maskedAccount = "****" + toAccount.slice(-4);

  const subject = "Transaction Alert – Action Required";

  const content = `
    <p>Dear ${name},</p>

    <p>We regret to inform you that your recent transaction could not be completed.</p>

    <table style="width:100%; border-collapse: collapse; margin-top: 15px;">
      <tr>
        <td><strong>Transaction ID:</strong></td>
        <td>${transactionId}</td>
      </tr>
      <tr>
        <td><strong>Amount:</strong></td>
        <td>$${amount}</td>
      </tr>
      <tr>
        <td><strong>Destination Account:</strong></td>
        <td>${maskedAccount}</td>
      </tr>
      <tr>
        <td><strong>Date & Time:</strong></td>
        <td>${formattedDate}</td>
      </tr>
    </table>

    <p style="margin-top:20px;">
      No funds have been debited from your account.
      This may be due to insufficient balance, temporary system issues, or security verification requirements.
    </p>

    <p>Please review your account details and try again. If the issue persists, our support team is available to assist you.</p>

    <p>We apologize for any inconvenience caused.</p>

    <p>Kind regards,<br><strong>Backend Ledger Support Team</strong></p>
  `;

  const html = generateEmailTemplate({
    title: "Transaction Failed",
    content,
  });

  await sendEmail(userEmail, subject, "", html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful";

  const content = `
    <p>Dear ${name},</p>
    <p>Your transaction of <strong>$${amount}</strong> to account ending in 
    <strong>${toAccount.slice(-4)}</strong> was completed successfully.</p>
    <p>Please find your receipt attached.</p>
  `;

  const html = generateEmailTemplate({
    title: "Transaction Confirmation",
    content,
  });

  // 🔹 Generate PDF
  const pdfPath = generateTransactionPDF({
    id: Date.now(),
    amount,
    toAccount,
  });

  // 🔹 Send email with attachment
  await sendEmail(userEmail, subject, "", html, [
    {
      filename: "transaction-receipt.pdf",
      path: pdfPath,
    },
  ]);
}

async function sendMonthlyStatement(userEmail, name, summary) {
  const subject = "Your Monthly Account Statement";

  const content = `
    <p>Dear ${name},</p>

    <p>Here is your monthly account summary:</p>

    <ul>
      <li>Total Transactions: ${summary.totalTransactions}</li>
      <li>Total Credit: $${summary.totalCredit}</li>
      <li>Total Debit: $${summary.totalDebit}</li>
      <li>Closing Balance: $${summary.balance}</li>
    </ul>

    <p>You may download the detailed statement from your dashboard.</p>
  `;

  const html = generateEmailTemplate({
    title: "Monthly Account Summary",
    content,
  });

  await sendEmail(userEmail, subject, "", html);
}

async function sendSecurityAlertEmail(userEmail, name) {
  const subject = "Security Alert – Unusual Activity Detected";

  const content = `
    <p>Dear ${name},</p>

    <p>We detected a login attempt from a new device or location.</p>

    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>

    <p>If this was you, no action is required.</p>
    <p>If not, please reset your password immediately.</p>
  `;

  const html = generateEmailTemplate({
    title: "Security Alert",
    content,
  });

  await sendEmail(userEmail, subject, "", html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
  sendMonthlyStatement,
  sendSecurityAlertEmail,
};
