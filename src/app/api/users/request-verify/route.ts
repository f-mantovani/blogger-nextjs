import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/database'
import { User } from '@/models'
import { errorResponse, sendEmail } from '@/helpers'
import dayjs from 'dayjs'

connect()
export const POST = async (request: NextRequest) => {
	try {
		const requestBody = await request.json()
		const { _id } = requestBody
		const userFromDB = await User.findById(_id)

		if (!userFromDB) {
			throw {
				message: 'Problems finding the user. Please try again later',
				status: 500,
			}
		}

		const hashedToken = encodeURIComponent(crypto.randomUUID())

		const expiry = dayjs().clone().add(15, 'minutes').toDate()
		userFromDB.verifyToken = hashedToken
		userFromDB.verifyTokenExpiry = new Date(expiry)
		await userFromDB.save()

		await sendEmail({ email: userFromDB.email, emailType: 'VERIFY', hashedToken })

		return NextResponse.json({ message: 'Email sent sucessfully', success: true })
	} catch (error: any) {
		error.path = 'Request Verify / Reset password'
		return errorResponse(error)
	}
}
