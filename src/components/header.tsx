import Link from 'next/link';
import { Logo } from './icons/logo';

export function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b bg-card shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 text-foreground">
          <Logo className="h-8 w-8 text-accent" />
          <span className="text-2xl font-headline font-bold">ArtisanAI</span>
        </Link>
        {/* Future navigation links can go here */}
      </div>
    </header>
  );
}
