'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { authService } from '@/lib'

const VerifyEmail = () => {
	const [token, setToken] = useState<null | string>(null)
	const [success, setSuccess] = useState(false)
	const [id, setId] = useState<null | string>(null)
	const searchParams = useSearchParams()

	const resendEmailVerification = async () => {
		try {
			const { data } = await authService.requestEmail(id!, 'verify')
			console.log(data)
		} catch (error: any) {
			const { data } = error
			setSuccess(data.success)
			setId(data.extra._id)
		}
	}

	const fetchToken = async () => {
		if (token === null) return
		try {
			console.log('inside fetch')
			const { data } = await authService.verifyEmail(token!)
			console.log(data)
			setSuccess(data.success)
		} catch (error: any) {
			const { data } = error
			console.log(error)
			setSuccess(data.success)
			setId(data.extra._id)
		}
	}

	useEffect(() => {
		const urlToken = searchParams.get('token')
		setToken(urlToken)
	}, [])

	useEffect(() => {
		fetchToken()
	}, [token])
	return (
		<>
			{!token ? (
				<p>getting your info to verify</p>
			) : token && !success ? (
				<button
					className='rounded border-amber-100 px-2 py-3 bg-amber-100 text-black'
					onClick={resendEmailVerification}
				>
					resend the verification email
				</button>
			) : (
				<p> verified sucessfully</p>
			)}
		</>
	)
}
export default VerifyEmail
