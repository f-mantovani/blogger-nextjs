import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/database'
import { errorResponse, verifyToken } from '@/helpers'
import { JwtPayload } from 'jsonwebtoken'
import { User } from '@/models'

connect()

export const GET = async (request: NextRequest) => {
	try {
		const headers = request.headers.get('CSRF')
		if (!headers) throw { message: `CSRF Token not found`, status: 400 }

		const token = request.cookies.get('token')
		if (!token) throw { message: `Token not found`, status: 400 }

		const decodedToken = verifyToken(token.value) as JwtPayload & { _id: string; csrf: string }

		if (decodedToken.csrf !== headers)
			throw { message: `Something went wrong in your validation`, status: 400 }

		const userFromDB = await User.findById(decodedToken._id)

		if (!userFromDB) throw { message: `Couldn't validate the login`, status: 400 }

		const userFound = {
			sub: userFromDB._id,
			email: userFromDB.email,
		}

		return NextResponse.json({ success: true, userFound })
	} catch (error: any) {
		error.path = 'Verify token'
		return errorResponse(error)
	}
}
