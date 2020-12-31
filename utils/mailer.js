const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const { TTLF_MAILER_API_KEY } = process.env;

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: TTLF_MAILER_API_KEY,
  },
}));

const emailTemplates = {
  newAdmin: '<h1>You have been added as a TTLF administrator</h1>',
  passwordReset: `
    <h1>You have request to reset your password</h1>
    <a href="${''}/reset-password?id=${''}">Click here to reset it</a>
  `,
};

module.exports.sendMail = ({ email, subject, template }) => {
  transporter.sendMail({
    to: email,
    from: 'admin@ttlf.net',
    subject,
    html: emailTemplates[template],
  });
};
