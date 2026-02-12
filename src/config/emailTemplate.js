const brand = require("./emailTheme");

function generateEmailTemplate({ title, content }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:${brand.primaryColor};padding:20px;">
                <img src="${brand.logoUrl}" alt="Logo" width="120" style="margin-bottom:10px;" />
                <h2 style="color:#ffffff;margin:0;">${brand.companyName}</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:25px;color:#333;font-size:15px;line-height:1.6;">
                <h3 style="margin-top:0;">${title}</h3>
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f1f5f9;padding:20px;font-size:12px;color:#555;">
                <p style="margin:0;">
                  This is an automated notification. Never share your credentials.
                </p>
                <p style="margin-top:8px;">
                  © ${new Date().getFullYear()} ${brand.companyName}. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

module.exports = generateEmailTemplate;
