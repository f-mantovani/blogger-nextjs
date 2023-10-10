import { NextResponse } from 'next/server'

export const errorResponse = (error: {
	message: string
	success: boolean
	status: number
	path: string
	extra: any
}) =>
	NextResponse.json(
		{
			success: false,
			message: error.message,
			path: error.path,
			extra: { ...error.extra },
		},
		{ status: error.status || 500 }
	)
