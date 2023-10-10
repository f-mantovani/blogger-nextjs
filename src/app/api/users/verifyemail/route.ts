import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/database'
import { User, UserDocument, UserInferred } from '@/models'
import { errorResponse } from '@/helpers'
import dayjs from 'dayjs'

connect()
export const POST = async (request: NextRequest) => {
	try {
		const requestBody = await request.json()
		const { token } = requestBody
		const userFromDB = await User.findOne({ verifyToken: token })

		if (!userFromDB) {
			throw {
				message: `Couldn't find the user`,
				status: 400,
			}
		}

		const date = dayjs().isBefore(dayjs(userFromDB.verifyTokenExpiry))

		if (!date) {
			throw {
				message: `Expired token`,
				status: 403,
				extra: { _id: userFromDB._id },
			}
		}

		userFromDB.isVerified = true
		userFromDB.verifyToken = undefined
		userFromDB.verifyTokenExpiry = undefined
		await userFromDB.save()

		return NextResponse.json({ message: 'User sucessfully verified', success: true })
	} catch (error: any) {
		error.path = 'Verify email'
		return errorResponse(error)
	}
}
