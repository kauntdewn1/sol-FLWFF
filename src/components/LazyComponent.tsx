import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Componente pesado que será carregado sob demanda
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Carregando...</div>,
  ssr: false // Desabilita SSR para este componente
})

// Componente que usa lazy loading
export const LazyComponent = () => {
  return (
    <div>
      <h1>Conteúdo Principal</h1>
      <Suspense fallback={<div>Carregando componente pesado...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  )
}

// Exemplo de uso com múltiplos componentes
export const MultipleLazyComponents = () => {
  const components = {
    Chart: dynamic(() => import('./Chart'), {
      loading: () => <div>Carregando gráfico...</div>
    }),
    Map: dynamic(() => import('./Map'), {
      loading: () => <div>Carregando mapa...</div>
    }),
    Video: dynamic(() => import('./Video'), {
      loading: () => <div>Carregando vídeo...</div>
    })
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Carregando componentes...</div>}>
        <div className="grid">
          <components.Chart />
          <components.Map />
          <components.Video />
        </div>
      </Suspense>
    </div>
  )
} 