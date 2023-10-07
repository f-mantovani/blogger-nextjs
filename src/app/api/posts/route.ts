import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
	try {
		return NextResponse.json({ message: 'works' })
	} catch (error: any) {}
}

export const GET = async (request: NextRequest) => {
	return NextResponse.json({ message: 'works' })
}
