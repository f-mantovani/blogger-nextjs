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
	const baseUrl = `${process.env.DOMAIN}/`
	const isVerify = emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'
	const params = new URLSearchParams()
	params.set('token', hashedToken)

	const url = new URL(`${baseUrl}${isVerify}?${params.toString()}`)

	const mailOptions = {
		from: process.env.GMAIL_USER,
		to: email,

		subject: `${emailType === 'VERIFY' ? 'Verify your account' : 'Reset your password'}`,
		html: `<p>Click <a href="${url.href}">here</a> to ${
			emailType === 'VERIFY' ? 'verify your email' : 'reset your password'
		} or copy the link below into your browser <span>${
			url.href
		}<span> This link is valid for 15 minutes
    `,
	}

	return transporter.sendMail(mailOptions)
}
