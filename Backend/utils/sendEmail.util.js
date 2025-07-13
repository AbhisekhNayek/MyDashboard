import nodeMailer from "nodemailer";

// Function to send an email using SMTP configuration from environment variables
export const sendEmail = async ({ email, subject, message }) => {
  // Create a reusable transporter object using SMTP transport
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,        // SMTP server hostname
    service: process.env.SMTP_SERVICE,  // SMTP service provider name (optional)
    port: process.env.SMTP_PORT,        // SMTP port number
    auth: {
      user: process.env.SMTP_MAIL,      // SMTP authentication email
      pass: process.env.SMTP_PASSWORD,  // SMTP authentication password
    },
  });

  // Setup email options
  const options = {
    from: process.env.SMTP_MAIL,  // Sender address
    to: email,                   // Receiver email address
    subject,                     // Email subject line
    html: message,               // Email body in HTML format
  };

  // Send email asynchronously
  await transporter.sendMail(options);
};
