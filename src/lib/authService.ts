import { ApiConnection } from './axiosAbstraction'

type User = { email: string; password: string }

class AuthService extends ApiConnection {
	constructor() {
		super('users')
	}

	async verifyEmail(token: string) {
		return this.post({ token }, '/verifyemail')
	}

	async requestEmail(_id: string, request_type: 'verify' | 'forgottenPassword') {
		return this.post({ _id, request_type }, '/request-verify')
	}

	async verify() {
		return this.get('/verify')
	}

	async signup(newUser: User) {
		return this.post(newUser, '/signup')
	}

	async login(userInfo: User) {
		return this.post(userInfo, '/login')
	}

	async refreshToken() {
		this.get('/refresh-token')
	}
}

const authService = new AuthService()
export { authService }
