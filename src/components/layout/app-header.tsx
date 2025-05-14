import Image from 'next/image';
import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="py-4 md:py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-md">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
          <Image
            src="https://res.cloudinary.com/dgyocpguk/image/upload/v1747181760/2_zucoyt.png"
            alt="Logo FLWFF"
            width={60}
            height={60}
            className="rounded-full group-hover:opacity-80 transition-opacity duration-300"
            priority
            data-ai-hint="abstract logo"
          />
          <span className="self-center text-2xl md:text-3xl font-mono font-semibold whitespace-nowrap text-primary group-hover:text-accent transition-colors duration-300">
            FLWFF
          </span>
        </Link>
      </div>
    </header>
  );
}
