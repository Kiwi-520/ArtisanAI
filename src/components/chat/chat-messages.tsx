'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from '@/components/icons/logo';
import { User } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type ChatMessagesProps = {
  messages: Message[];
};

export function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollableContainerRef} className="p-4 sm:p-6 space-y-6 h-full overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex items-start gap-4',
            message.role === 'user' && 'justify-end'
          )}
        >
          {message.role === 'assistant' && (
            <Avatar className="w-8 h-8 border-2 border-accent">
              <AvatarFallback className="bg-accent/20">
                <Logo className="w-5 h-5 text-accent" />
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={cn(
              'max-w-md lg:max-w-lg rounded-xl px-4 py-3 text-sm md:text-base shadow-md',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-none'
                : 'bg-card text-card-foreground rounded-bl-none',
              message.role === 'system' && 'bg-red-100 border-red-400 text-red-800'
            )}
          >
            {typeof message.content === 'string' ? <p className="whitespace-pre-wrap">{message.content}</p> : message.content}
          </div>

          {message.role === 'user' && (
             <Avatar className="w-8 h-8 border-2 border-primary">
              <AvatarFallback className="bg-primary/20">
                <User className="w-5 h-5 text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
}
