import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

const { TTLF_MAILER_API_KEY } = process.env;

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: TTLF_MAILER_API_KEY,
  },
}));

const emailTemplates = (attrs) => ({
  newAdmin: `
    <h3>You have been added as a TTLF administrator</h3>
    <a href="${attrs.origin}/login">Click here to login</a>
  `,
  passwordReset: `
    <h3>You have requested to reset your password</h3>
    <a href="${attrs.origin}/reset-password?token=${attrs.token}&email=${attrs.email}">Click here to reset it</a>
  `,
});

export default ({
  email, subject, template, attrs,
}) => {
  transporter.sendMail({
    to: email,
    from: 'admin@ttlf.net',
    subject,
    html: emailTemplates(attrs)[template],
  });
};
