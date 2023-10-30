import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/database'
import { User } from '@/models'
import { createToken, errorResponse, sendEmail } from '@/helpers'
import dayjs from 'dayjs'

connect()
export const POST = async (request: NextRequest) => {
	try {
		const requestBody = await request.json()
		const { _id, request_type }: { _id: string; request_type: 'verify' | 'forgottenPassword' } =
			requestBody
		const userFromDB = await User.findById(_id)

		if (!userFromDB) {
			throw {
				message: 'Problems finding the user. Please try again later',
				status: 500,
			}
		}

		const hashedToken = createToken({ test: 'test' }, { expiresIn: '15m' })

		const whichToken = `${request_type}Token` as const
		userFromDB[whichToken] = hashedToken

		await userFromDB.save()
		const emailType: 'VERIFY' | 'PASSWORD' = request_type === 'verify' ? 'VERIFY' : 'PASSWORD'

		await sendEmail({ email: userFromDB.email, emailType, hashedToken })

		return NextResponse.json({
			message: 'Email sent sucessfully',
			success: true,
		})
	} catch (error: any) {
		error.path = 'Request Verify / Reset password'
		return errorResponse(error)
	}
}
