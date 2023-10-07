import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/database'
import { User, UserDocument } from '@/models'
import { errorResponse, generateHash, sendEmail } from '@/helpers'
import dayjs from 'dayjs'

connect()
export const POST = async (request: NextRequest) => {
	try {
		const requestBody = await request.json()
		const { email, password } = requestBody

		const userFromDB = await User.findOne({ email })

		// if (userFromDB) {
		// 	throw {
		// 		message: 'User already registered',
		// 		status: 400,
		// 	}
		// }

		const passwordHash = await generateHash(password)

		const newUser: UserDocument = await User.create({ email, password: passwordHash })

		const hashedToken = encodeURIComponent(await generateHash(newUser._id.toString()))
		newUser.verifyToken = hashedToken
		const expiry = dayjs().clone().add(15, 'minutes')
		newUser.verifyTokenExpiry = new Date(expiry)
		await newUser.save()

		await sendEmail({ email, emailType: 'VERIFY', hashedToken })

		return NextResponse.json({ message: 'User created successfully', newUser })
	} catch (error: any) {
		error.path = 'Sign up'
		return errorResponse(error)
	}
}
