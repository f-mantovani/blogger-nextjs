import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'

export const createToken = (payload: any, options?: SignOptions) => {
	if (!process.env.JWT_SECRET) {
		throw {
			message: `We can't proceed without a secret`,
			status: 500,
			path: `JWT Token creation`,
		}
	}
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '20m', ...options })
}

export const verifyToken = (token: string, options?: VerifyOptions) => {
	if (!process.env.JWT_SECRET) {
		throw {
			message: `We can't proceed without a secret`,
			status: 500,
			path: `JWT Token creation`,
		}
	}
	return jwt.verify(token, process.env.JWT_SECRET, { ...options })
}
