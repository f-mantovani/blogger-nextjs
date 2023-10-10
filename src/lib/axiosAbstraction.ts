import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

type Data = Record<string | number, any>

class ApiConnection {
	protected api: AxiosInstance
	constructor(childPath: string) {
		this.api = axios.create({
			baseURL: `${process.env.DOMAIN}/api/${childPath}`,
			// withCredentials: true,
		})

		this.api.interceptors.response.use(
			(config) => config,
			(error) => {
				const {
					response: { data },
				} = error
				throw { data, Error: error }
			}
		)
	}

	protected async get(url?: string, options?: AxiosRequestConfig) {
		const urlChecker = `${url ? `${url}` : '/'}`
		return this.api.get(urlChecker, { ...options })
	}

	protected async post(data: Data, url?: string, options?: AxiosRequestConfig) {
		const urlChecker = url ? `${url}` : '/'
		return this.api.post(urlChecker, data, { ...options })
	}

	protected async patch(data: Data, url: string, options?: AxiosRequestConfig) {
		return this.api.patch(`/${url}`, data, { ...options })
	}

	protected async delete(url: string, options?: AxiosRequestConfig) {
		return this.api.delete(`/${url}`, { ...options })
	}
}

export { ApiConnection }
