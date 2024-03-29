const nodemailer = require('nodemailer');
const { convert } = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    // to, firstName, url, from
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport(
        //   {
        //     host: process.env.MAILGUN_HOST,
        //     port: process.env.MAILGUN_PORT,
        //     secure: false,
        //     auth: {
        //       user: process.env.MAILGUN_USER,
        //       pass: process.env.MAILGUN_PASS
        //     }
        //   }
        // );
        {
          service: 'Mailgun',
          auth: {
            user: process.env.MAILGUN_USER,
            pass: process.env.MAILGUN_PASS
          }
        }
      );
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emailTemplates/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: convert(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
