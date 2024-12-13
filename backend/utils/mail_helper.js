const nodemailer =require('nodemailer');


const sendOtpMail = (email, obj) => {
	try {
	  const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
		  user: 'ironbolt7610@gmail.com',
		  pass: 'prerak@123P',
		},
	  });
  
	  const mailOptions = {
		from: `Support <ironbolt7610@gmail.com>`,
		to: email,
		subject: obj.subject,
		html: obj.html,
	  };
  
	  transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
		  console.log("error in send email", error);
		}
		console.log("info",info)
	  });
	} catch (err) {
	  console.log("error in send email function", err);
	}
  };

  module.exports = {
	sendOtpMail:sendOtpMail
  }