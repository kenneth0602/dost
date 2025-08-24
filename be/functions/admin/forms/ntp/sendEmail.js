const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'erecords183@gmail.com',
        pass: 'qbjwwzncqybktdiz'
      }
});

const handler = (email) => {
  console.log("sendEmail Handler")
//   const email = email; 
  

  const mailOptions = {
    from: 'erecords183@gmail.com',
    to: email,
    subject: 'Notice of Participant',
    html: `We are pleased to inform you that you are officially registered for the upcoming training program. You can check your account to confirm your participation. Thank you for joining us!`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    //   callback.status(500).json({ message: 'Failed to send password reset email' });
        return
    } else {
    //   callback.status(200).json({ message: 'Password reset email sent' });
        return
    }
  });
};



module.exports = handler