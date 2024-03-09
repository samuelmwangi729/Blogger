const nodemailer = require("nodemailer");
require("dotenv").config();
const sendEmail = async (to,subject,action,message) => {
  let LogoLink=`${process.env.DOMAIN_NAME}/images/logos/logo-1.png`
  const preheader="<strong>Attention! Your Account Needs a Review</strong>"
  try {
    //create transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USERNAME, // generated ethereal user
        pass: process.env.GMAIL_PASSWORD, // generated ethereal password
      },
    });
    //setup email data with unicode symbols
    const mailOptions = {
      from: process.env.GMAIL_USERNAME, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: `
        <!DOCTYPE html>
        <html>
        <head>

          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>${action}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">

          <link href="https://fonts.googleapis.com/css?family=Rajdhani:400,600,700&display=swap" rel="stylesheet">

          <style type="text/css">

          body,
          table,
          td,
          a {
            -ms-text-size-adjust: 100%; /* 1 */
            -webkit-text-size-adjust: 100%; /* 2 */
          }
          table,
          td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
          }
          
          img {
            -ms-interpolation-mode: bicubic;
          }
        
          a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
          }
        
          div[style*="margin: 16px 0;"] {
            margin: 0 !important;
          }
          body {
            font-family: 'Rajdhani', sans-serif;
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          table {
            border-collapse: collapse !important;
          }
          a {
            color: #1a82e2;
          }
          img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
          }
          </style>

        </head>
        <body style="background-color: #e9ecef;">

          <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
            ${preheader} ${subject}
          </div>
          <!-- end preheader -->

          <!-- start body -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">

            <!-- start logo -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="center" valign="top" style="padding: 36px 24px;">
                      <a href="#" target="_blank" style="display: inline-block;">
                        <img src="${LogoLink}" alt="${process.env.APP_TITLE}" border="0" width="160" style="display: block; width: 160px; max-width: 160px; min-width: 48px;">
                      </a>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end logo -->

            <!-- start hero -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Rajdhani', sans-serif; border-top: 3px solid #d4dadf;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">${subject}</h1>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end hero -->

            <!-- start copy block -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Rajdhani', sans-serif; font-size: 16px; line-height: 24px;">
                      <p style="margin: 0;">
                      ${message}
                      </p>
                    </td>
                  </tr>
                  <!-- end copy -->
                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Rajdhani', sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                      <p style="margin: 0;">Cheers,<br> ${process.env.APP_TITLE} Team</p>
                    </td>
                  </tr>
                  <!-- end copy -->

                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end copy block -->

            <!-- start footer -->
            <tr>
              <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                  <!-- start permission -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Rajdhani', sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                      <p style="margin: 0;">You received this email because you engaged in an activity using  your account.</p>
                    </td>
                  </tr>
                  <!-- end permission -->

                  <!-- start unsubscribe -->
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end footer -->

          </table>
          <!-- end body -->

        </body>
        </html> 
            `,
    };
    //send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);
    return "success";
  } catch (error) {
    return error;
  }
};

module.exports = sendEmail