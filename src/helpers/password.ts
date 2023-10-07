import bcrypt from 'bcrypt'

export const generateHash = async (password: string) => {
	return bcrypt.hash(password, 1)
}

export const compareHash = async (password: string, candidatePassword: string) => {
	return bcrypt.compare(candidatePassword, password)
}
