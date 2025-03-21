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
      <div className="w-full max-w-md px-4 py-8">

        <Card className="w-full shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-xl">Registro</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                className="w-full py-2 bg-green-400 hover:bg-green-500 text-black font-medium transition-colors"
              >
                Registrar
              </Button>
            </form>

            <div className="mt-4 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <Button
              onClick={registerGithub}
              className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white font-medium flex items-center justify-center gap-2"
            >
              <GithubIcon className="w-5 h-5" />
              Registrar com Github
            </Button>

            <div className="mt-6 text-center text-sm text-gray-600">
              <span>Já tem uma conta?</span>{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Entrar
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
