'use client';

import { useData } from '@/hooks/useData';

interface User {
  id: number;
  name: string;
  email: string;
}

export function DataExample() {
  const { data, isLoading, isError } = useData<User[]>('/api/users');

  if (isLoading) return <div>Carregando...</div>;
  if (isError) return <div>Erro ao carregar dados</div>;
  if (!data) return null;

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <ul>
        {data.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
} 