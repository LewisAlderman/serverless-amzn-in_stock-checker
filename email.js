const nodemailer = require('nodemailer');

let retries = 0, maxRetries = 3;

module.exports.email = async (url) => {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.MAIL_USERNAME,
			pass: process.env.MAIL_PASSWORD,
			clientId: process.env.OAUTH_CLIENTID,
			clientSecret: process.env.OAUTH_CLIENT_SECRET,
			refreshToken: process.env.OAUTH_REFRESH_TOKEN
		}
	});
	
	await transporter.sendMail({
		to: process.env.MAIL_USERNAME,
		from: `"Serverless Scraper" <${process.env.MAIL_USERNAME}>`,
		priority: 'high',
		sender: "Serverless Page Checker/Scraper",
		subject: 'ALERT: Detected page change!',
		text: 'The page you are checking has recently changed!',
		html: `<div><p><b style="font-size: x-large;"><a href=\"${url}\">🚨⏰🚨⏰🚨⏰<br>Here, go and see for yourself!<br>⏰🚨⏰🚨⏰🚨</a></b></p><p>${url}</p></div>`,
	}, (err, info) => {
		if (err) {
			console.log(`Error sending email: `, err);

			if (retries < maxRetries) {
				console.log(`...retrying...(${retries+1}).....`);
				this.email(url);
				retries++;
			}
		} else {
			console.log(`Email sent >> ${info.response}`);
		}
	});
}