import { Schema, model, models, InferSchemaType, HydratedDocument } from 'mongoose'

const userSchema = new Schema(
	{
		email: {
			type: String,
			trim: true,
			required: [true, 'Please provide a valid email'],
			unique: true,
			// match
		},
		password: {
			type: String,
			required: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verifyToken: String,
		verifyTokenExpiry: Date,
		forgottenPasswordToken: String,
		forgottenPasswordTokenExpiry: Date,
	},
	{ timestamps: true }
)

const User = models.User || model('User', userSchema)

export default User
