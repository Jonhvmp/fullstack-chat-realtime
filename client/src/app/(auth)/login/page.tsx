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
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className='text-center'>Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full bg-green-400 text-black hover:bg-green-500">
              Entrar
            </Button>
          </form>

          <div className="mt-4">
            <Button onClick={handleGithubLogin} className="w-full bg-black text-white">
              Entrar com Github <GithubIcon className="w-6 h-6 inline-block" />
            </Button>
          </div>

          <div className="mt-4 text-center">
            <span>Não tem uma conta?</span>
            <Button variant="link" asChild>
              <Link href="/register" className='text-blue-700'>Registrar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

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
