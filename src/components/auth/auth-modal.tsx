
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, KeyRound, Wallet, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  triggerButton?: React.ReactNode;
}

export default function AuthModal({ triggerButton }: AuthModalProps) {
  const { loginWithWeb3, loginWithEmail, signupWithEmail, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true); // true for login, false for signup
  const [isOpen, setIsOpen] = useState(false);

  const handleWeb3Login = async () => {
    try {
      await loginWithWeb3();
      setIsOpen(false); // Close modal on successful Web3 login
      toast({ title: "Carteira Conectada!", description: "Você entrou no fluxo.", variant: "default" });
    } catch (error) {
      console.error('Web3 login failed', error);
      toast({ title: "Falha na Conexão", description: "Não foi possível conectar sua carteira.", variant: "destructive" });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoginView) {
        await loginWithEmail(email, password);
        toast({ title: "Login Bem-sucedido!", description: "Bem-vindo de volta ao Abismo.", variant: "default" });
      } else {
        await signupWithEmail(email, password);
        toast({ title: "Cadastro Realizado!", description: "Sua jornada no Coletivo FLWFF começou.", variant: "default" });
      }
      setIsOpen(false); // Close modal on successful email auth
    } catch (error: any) {
      console.error('Email auth failed', error);
      toast({ title: "Falha na Autenticação", description: error.message || "Verifique suas credenciais.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton ? triggerButton : <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Conectar / Entrar</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-primary/50">
        <DialogHeader>
          <DialogTitle className="text-primary font-mono text-2xl">Acessar o Coletivo FLWFF</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Conecte sua carteira ou use seu e-mail para continuar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <Button onClick={handleWeb3Login} disabled={authLoading} className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground h-12 text-lg">
            {authLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wallet className="mr-2 h-5 w-5" />}
            Conectar Carteira
          </Button>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <Label htmlFor="email-auth" className="text-muted-foreground">Email</Label>
              <Input
                id="email-auth"
                type="email"
                placeholder="seu.sinal@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground/50 h-11"
              />
            </div>
            <div>
              <Label htmlFor="password-auth" className="text-muted-foreground">Senha</Label>
              <Input
                id="password-auth"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground/50 h-11"
              />
            </div>
            <Button type="submit" disabled={authLoading} className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-12 text-lg">
              {authLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : isLoginView ? <KeyRound className="mr-2 h-5 w-5" /> : <Mail className="mr-2 h-5 w-5"/>}
              {isLoginView ? 'Entrar com Email' : 'Cadastrar com Email'}
            </Button>
          </form>
        </div>
        <DialogFooter className="sm:justify-center">
           <Button variant="link" onClick={() => setIsLoginView(!isLoginView)} className="text-primary">
            {isLoginView ? 'Não tem uma conta? Cadastre-se.' : 'Já tem uma conta? Faça login.'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
