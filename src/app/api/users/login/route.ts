import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/database'
import { User } from '@/models'
import { compareHash, createToken, errorResponse } from '@/helpers'

connect()
export const POST = async (request: NextRequest) => {
	try {
		const requestBody = await request.json()
		const userFromDB = await User.findOne({ email: requestBody.email })
		if (!userFromDB) {
			throw {
				message: 'User and/or password incorrect',
				status: 400,
			}
		}

		const passwordMatch = await compareHash(userFromDB.password, requestBody.password)

		if (!passwordMatch) {
			throw {
				message: 'User and/or password incorrect',
				status: 400,
			}
		}

		if (!userFromDB.isVerified) {
			throw {
				message: 'Sorry you need to verify your account before login',
				status: 403,
			}
		}

		const csrf = {
			access: crypto.randomUUID(),
			refresh: crypto.randomUUID(),
		}

		const { _id } = userFromDB._id

		const payload = {
			_id,
			csrf: csrf.access,
		}

		const csrfPayload = {
			_id,
			csrf: csrf.refresh,
		}

		const token = createToken(payload, { expiresIn: '15s' })
		const refreshToken = createToken(csrfPayload, { expiresIn: '6h' })

		const response = NextResponse.json({
			success: true,
			csrf: csrf.access,
			csrfRefresh: csrf.refresh,
		})

		response.cookies.set('token', token, {
			httpOnly: true,
			sameSite: true,
			secure: true,
		})
		response.cookies.set('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: true,
			secure: true,
		})

		return response
	} catch (error: any) {
		error.path = 'Login'
		return errorResponse(error)
	}
}
