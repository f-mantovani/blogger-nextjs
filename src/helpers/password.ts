import bcrypt from 'bcrypt'

const SALT_ROUNDS = 15

export const generateHash = async (password: string) => {
	return bcrypt.hash(password, SALT_ROUNDS)
}

export const compareHash = async (password: string, candidatePassword: string) => {
	return bcrypt.compare(candidatePassword, password)
}
