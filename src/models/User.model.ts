import { Schema, model, models, InferSchemaType, HydratedDocument } from 'mongoose'
import { Infer } from 'next/dist/compiled/superstruct'

const userSchema = new Schema(
	{
		email: {
			type: String,
			trim: true,
			required: [true, 'Please provide a valid email'],
			// unique: true,
			// match
		},
		password: {
			type: String,
			required: [true, 'Please provide a valid password'],
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

export type UserInferred = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<UserInferred>

export const User = models.User || model('User', userSchema)
