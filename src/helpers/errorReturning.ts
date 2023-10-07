import { NextResponse } from 'next/server'

export const errorResponse = (error: {
	message: string
	success: boolean
	status: number
	path: string
}) =>
	NextResponse.json(
		{
			success: false,
			message: error.message,
			path: error.path,
		},
		{ status: error.status || 500 }
	)
