// app/services/authService.ts
import axios from 'axios'

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  id: string
  name: string
  email: string
}

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL

export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      data,
      { withCredentials: true }
    )
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error
    }
    throw new Error('An unexpected error occurred')
  }
}
