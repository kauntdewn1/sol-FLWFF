import React from 'react'
import * as Sentry from '@sentry/nextjs'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo)
      Sentry.captureException(error)
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-boundary">
          <h2>Algo deu errado</h2>
          <p>Desculpe, ocorreu um erro inesperado.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
          >
            Tentar novamente
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Exemplo de uso:
/*
<ErrorBoundary
  fallback={
    <div>
      <h1>Erro personalizado</h1>
      <p>Algo deu errado, mas você pode tentar novamente.</p>
    </div>
  }
>
  <SeuComponente />
</ErrorBoundary>
*/ 