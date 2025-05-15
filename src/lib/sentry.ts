import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'solana.com'],
    }),
  ],
  beforeSend(event) {
    // Não enviar eventos em ambiente de desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      return null
    }
    return event
  },
})

// Função auxiliar para capturar erros
export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }
    Sentry.captureException(error)
  })
}

// Função auxiliar para capturar mensagens
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level)
}

// Função auxiliar para adicionar contexto ao usuário
export const setUser = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser(user)
}

// Função auxiliar para limpar contexto do usuário
export const clearUser = () => {
  Sentry.setUser(null)
}

export default Sentry 