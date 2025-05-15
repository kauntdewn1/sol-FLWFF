import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        setMetrics((prev) => ({
          ...prev,
          fcp: entries[0].startTime,
        }))
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        setMetrics((prev) => ({
          ...prev,
          lcp: entries[entries.length - 1].startTime,
        }))
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        setMetrics((prev) => ({
          ...prev,
          fid: entries[0].processingStart - entries[0].startTime,
        }))
      }
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0
      const entries = entryList.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      setMetrics((prev) => ({
        ...prev,
        cls: clsValue,
      }))
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      setMetrics((prev) => ({
        ...prev,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
      }))
    }

    // Cleanup
    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [])

  return metrics
}

// Exemplo de uso:
/*
const MyComponent = () => {
  const metrics = usePerformance()

  useEffect(() => {
    if (metrics.lcp && metrics.lcp > 2500) {
      console.warn('LCP está acima do recomendado:', metrics.lcp)
    }
  }, [metrics])

  return (
    <div>
      <h1>Métricas de Performance</h1>
      <ul>
        <li>FCP: {metrics.fcp?.toFixed(2)}ms</li>
        <li>LCP: {metrics.lcp?.toFixed(2)}ms</li>
        <li>FID: {metrics.fid?.toFixed(2)}ms</li>
        <li>CLS: {metrics.cls?.toFixed(3)}</li>
        <li>TTFB: {metrics.ttfb?.toFixed(2)}ms</li>
      </ul>
    </div>
  )
}
*/ 