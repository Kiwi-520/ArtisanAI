import { ChatInterface } from '@/components/chat/chat-interface';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4">
        <ChatInterface />
      </main>
    </div>
  );
}
