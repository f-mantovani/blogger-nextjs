import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
	const id = params.id

	return NextResponse.json({ message: 'works', id })
}

export const POST = async (request: NextRequest, { params }: { params: { id: string } }) => {
	const id = params.id

	return NextResponse.json({ message: 'works in the post', id })
}
