import { NextRequest, NextResponse } from 'next/server'
import { connect } from '@/database'
import { createToken, errorResponse, verifyToken } from '@/helpers'
import { JwtPayload } from 'jsonwebtoken'

connect()
export const GET = async (request: NextRequest) => {
	try {
		const headers = request.headers.get('CSRF_REFRESH')
		if (!headers) throw { message: `CSRF refresh Token not found`, status: 400 }

		const token = request.cookies.get('refresh_token')
		if (!token) throw { message: `Refresh token not found`, status: 400 }

		const decodedToken = verifyToken(token.value) as JwtPayload & { _id: string; csrf: string }

		if (decodedToken.csrf !== headers)
			throw { message: `Something went wrong in your validation`, status: 400 }

		const payload = {
			_id: decodedToken._id,
			csrf: crypto.randomUUID(),
		}

		const newToken = createToken(payload, { expiresIn: '15s' })

		const response = NextResponse.json({
			success: true,
			csrf: payload.csrf,
		})

		return response
	} catch (error: any) {
		error.path = 'Verify refresh token'
		return errorResponse(error)
	}
}
