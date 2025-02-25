'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@src/contexts/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GithubIcon } from 'lucide-react'
import Link from 'next/link'
import { TwoFactorAuthDialog } from '@/components/auth/TwoFactorAuthDialog'
import axios from 'axios'

export default function LoginPage() {
  const { login, SignInOrSignUpWithGithub } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [show2FADialog, setShow2FADialog] = useState(false)
  const [loading2FA, setLoading2FA] = useState(false)
  const [error2FA, setError2FA] = useState<{ message: string; details?: string } | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login(email, password);

      // Se o retorno indicar necessidade de 2FA
      if ('require2FA' in response) {
        setShow2FADialog(true);
        return;
      }

      router.push('/chat');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao efetuar login');
      } else {
        setError('Erro ao efetuar login');
      }
    }
  };

  const handle2FASubmit = async (code: string) => {
    setLoading2FA(true);
    setError2FA(null);

    try {
      await login(email, password, code);
      setShow2FADialog(false);
      router.push('/chat');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError2FA({
          message: err.response?.data?.message || 'Erro ao verificar código 2FA',
          details: err.response?.data?.details
        });
      } else {
        setError2FA({
          message: 'Erro ao verificar código 2FA'
        });
      }
    } finally {
      setLoading2FA(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await SignInOrSignUpWithGithub()
      setTimeout(() => {
        router.push('/chat')
      }, 500)
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao efetuar login'
      setError(errorMessage)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-4 py-8">
        <Card className="w-full shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button
                type="submit"
                className="w-full py-2 bg-green-400 hover:bg-green-500 text-black font-medium transition-colors"
              >
                Entrar
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
              onClick={handleGithubLogin}
              className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white font-medium flex items-center justify-center gap-2"
            >
              <GithubIcon className="w-5 h-5" />
              Entrar com Github
            </Button>

            <div className="mt-6 text-center text-sm text-gray-600">
              <span>Não tem uma conta?</span>{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Registrar
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <TwoFactorAuthDialog
        open={show2FADialog}
        onOpenChange={setShow2FADialog}
        onSubmit={handle2FASubmit}
        error={error2FA}
        loading={loading2FA}
      />
    </div>
  )
}
