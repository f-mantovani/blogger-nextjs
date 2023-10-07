import mail from 'nodemailer'

const transporter = mail.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS,
	},
})

type EmailProps = {
	email: string
	emailType: 'VERIFY' | 'PASSWORD'
	hashedToken: string
}

export const sendEmail = async ({ email, emailType, hashedToken }: EmailProps) => {
	const mailOptions = {
		from: process.env.GMAIL_USER,
		to: email,
		subject: `${emailType === 'VERIFY' ? 'Verify your account' : 'Reset your password'}`,
		html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${
			emailType === 'VERIFY' ? 'verify your email' : 'reset your password'
		} or copy the link below into your browser <span>${
			process.env.DOMAIN
		}/verifyemail?token=${hashedToken}<span> This link is valid for 15 minutes
    `,
	}

	return transporter.sendMail(mailOptions)
}
