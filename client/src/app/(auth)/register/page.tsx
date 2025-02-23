'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { registerUser } from '@/services/authService'
import { useAuth } from '@src/contexts/auth/AuthContext'
import { GithubIcon } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const { SignInOrSignUpWithGithub } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('As senhas não conferem')
      return
    }

    try {
      await registerUser({ name, email, password })

      setTimeout(() => {
        router.push('/chat')
      }, 500)
    } catch (err: Error | unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Erro ao registrar')
    }
  }

  const registerGithub = async () => {
    try {
      await SignInOrSignUpWithGithub()
      setTimeout(() => {
        router.push('/chat')
      }, 500)
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar'
      setError(errorMessage)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className='text-center'>Registro</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full bg-green-400 text-black hover:bg-green-500 ">
              Registrar
            </Button>
          </form>

          <div className="mt-4">
            <Button onClick={registerGithub} className="w-full">
              Registrar com Github <GithubIcon className="w-6 h-6 inline-block" />
            </Button>
          </div>

          <div className="mt-4 text-center">
            <span>Não tem uma conta?</span>
            <Button variant="link" asChild>
              <Link href="/login" className='text-blue-700'>Entrar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
