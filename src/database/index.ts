import mongoose from 'mongoose'

export const connect = async () => {
	try {
		mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/next-blogger')
		const connection = mongoose.connection

		connection.on('connected', () => {
			console.log(`Connected successfully to ${connection.name} database`)
		})

		connection.on('error', (error) => {
			console.log(`MongoDB connection error. Please make sure the MongoDB is running ${error}`)
		})
	} catch (error) {
		console.error(`Something went wrong connecting to the DB ${error}`)
	}
}
