import { ApiConnection } from './axiosAbstraction'

class AuthService extends ApiConnection {
	constructor() {
		super('users')
	}

	async verifyEmail(token: string) {
		return this.post({ token }, '/verifyemail')
	}

	async requestEmail(_id: string) {
		return this.post({ _id }, '/request-verify')
	}
}

const authService = new AuthService()
export { authService }
