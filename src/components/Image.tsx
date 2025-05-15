import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'

interface ImageProps extends Omit<NextImageProps, 'onLoadingComplete'> {
  fallback?: string
}

export const Image = ({
  src,
  alt,
  fallback = '/images/placeholder.png',
  className,
  ...props
}: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <NextImage
        {...props}
        src={imgSrc}
        alt={alt}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallback)
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}

// Exemplo de uso:
/*
<Image
  src="/images/example.jpg"
  alt="Descrição da imagem"
  width={500}
  height={300}
  priority={true} // Para imagens acima da dobra
  loading="lazy" // Para imagens abaixo da dobra
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
*/ 