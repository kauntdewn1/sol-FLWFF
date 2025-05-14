
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { db, ensureFirebaseInitialized } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Import pt-BR locale
import { TrendingUp, History } from 'lucide-react';

interface Stake {
  id: string;
  amount: number;
  startDate: Timestamp;
  durationMonths: number;
  status: 'active' | 'completed'; // Add more statuses if needed
}

export default function MyStakesList() {
  const { user } = useAuth();
  const [stakes, setStakes] = useState<Stake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStakes = async () => {
      if (!user?.walletAddress) {
        setLoading(false);
        setStakes([]);
        return;
      }

      setLoading(true);
      ensureFirebaseInitialized();
      try {
        const stakesRef = collection(db, 'staking');
        const q = query(
          stakesRef,
          where('walletAddress', '==', user.walletAddress),
          orderBy('startDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedStakes: Stake[] = [];
        querySnapshot.forEach((doc) => {
          fetchedStakes.push({ id: doc.id, ...doc.data() } as Stake);
        });
        setStakes(fetchedStakes);
      } catch (error) {
        console.error("Error fetching stakes:", error);
        // Optionally, show a toast message for error
      } finally {
        setLoading(false);
      }
    };

    fetchStakes();
  }, [user]);

  if (loading) {
    return (
      <Card className="bg-card border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-mono text-primary flex items-center">
            <History className="mr-2 h-6 w-6" />
            Meus Stakes
          </CardTitle>
          <CardDescription className="text-muted-foreground">Carregando seus investimentos...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map(i => <Skeleton key={i} className="h-12 w-full rounded-md bg-input" />)}
        </CardContent>
      </Card>
    );
  }

  if (!user?.walletAddress) {
    return null; // Or a message to connect wallet
  }

  if (stakes.length === 0) {
    return (
      <Card className="bg-card border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-mono text-primary flex items-center">
             <History className="mr-2 h-6 w-6" />
            Meus Stakes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Você ainda não possui stakes ativos.</p>
        </CardContent>
      </Card>
    );
  }
  
  const calculateEndDate = (startDate: Date, durationMonths: number): Date => {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    return endDate;
  };


  return (
    <Card className="bg-card border-primary/20 shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-mono text-primary flex items-center">
            <History className="mr-2 h-6 w-6" />
            Meus Stakes Registrados
        </CardTitle>
        <CardDescription className="text-muted-foreground">Acompanhe seus compromissos com o fluxo $FLWFF.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-secondary">Montante</TableHead>
              <TableHead className="text-secondary">Início</TableHead>
              <TableHead className="text-secondary">Término Estimado</TableHead>
              <TableHead className="text-secondary">Duração</TableHead>
              <TableHead className="text-secondary text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stakes.map((stake) => {
              const startDate = stake.startDate.toDate();
              const endDate = calculateEndDate(startDate, stake.durationMonths);
              return (
                <TableRow key={stake.id} className="border-border/30 hover:bg-input/50">
                  <TableCell className="font-mono">{stake.amount.toLocaleString()} FLWFF</TableCell>
                  <TableCell>{format(startDate, 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  <TableCell>{format(endDate, 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  <TableCell>{stake.durationMonths} Meses</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={stake.status === 'active' ? 'secondary' : 'default'} className={stake.status === 'active' ? 'bg-secondary/20 text-secondary border-secondary/50' : 'bg-muted text-muted-foreground'}>
                      {stake.status === 'active' ? 'Ativo' : 'Concluído'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
