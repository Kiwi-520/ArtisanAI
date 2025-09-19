'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Message, ChatStep, StorefrontData } from '@/lib/types';
import { generateStorefrontContent } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { Card } from '@/components/ui/card';
import { ImageSettingOptions } from './image-setting-options';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Wand2 } from 'lucide-react';
import { Button } from '../ui/button';

const initialMessages: Message[] = [
  {
    id: 'intro-1',
    role: 'assistant',
    content: "Welcome to ArtisanAI! I'm here to help you craft a unique marketing story for your product.",
  },
  {
    id: 'intro-2',
    role: 'assistant',
    content: "Let's start with the name of your product. What is it called?",
  },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [chatStep, setChatStep] = useState<ChatStep>('product_name');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImageUri, setProductImageUri] = useState('');

  const addMessage = (message: Omit<Message, 'id'>) => {
    setMessages((prev) => [...prev, { ...message, id: crypto.randomUUID() }]);
  };

  const handleSendMessage = (text: string) => {
    addMessage({ role: 'user', content: text });

    switch (chatStep) {
      case 'product_name':
        setProductName(text);
        setChatStep('product_description');
        addMessage({
          role: 'assistant',
          content: `"${text}" is a great name! Now, please provide a detailed description of your product. What makes it special?`,
        });
        break;
      case 'product_description':
        setProductDescription(text);
        setChatStep('product_image');
        addMessage({
          role: 'assistant',
          content: 'Thank you. The final step is to upload a photo of your product. Please use a clear image with a plain background.',
        });
        break;
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      setProductImageUri(dataUri);
      addMessage({
        role: 'user',
        content: (
          <div className="flex items-center gap-2">
            <span>Uploaded: {file.name}</span>
            <Image src={dataUri} alt="Uploaded product" width={40} height={40} className="rounded-md" />
          </div>
        ),
      });
      setChatStep('image_setting');
      addMessage({
        role: 'assistant',
        content: 'Wonderful! Now, pick a setting to place your product in for an enhanced image:',
      });
    };
    reader.readAsDataURL(file);
  };

  const runGeneration = useCallback(async (setting: string) => {
    setChatStep('generating');
    setIsLoading(true);
    addMessage({
      role: 'assistant',
      content: 'Perfect! I have everything I need. Generating your marketing assets now. This might take a moment...',
    });

    try {
      const result = await generateStorefrontContent(
        productName,
        productDescription,
        productImageUri,
        setting
      );
      
      const storefrontUrl = `/storefront?data=${btoa(JSON.stringify(result))}`;

      addMessage({
        role: 'assistant',
        content: (
          <div className="space-y-4">
            <h3 className="font-headline text-lg">✨ Your AI-Generated Marketing Kit is Ready!</h3>
            <p>I've created a complete set of marketing materials and a beautiful digital storefront for your product.</p>
            <Button asChild>
              <Link href={storefrontUrl} target="_blank">
                View Your Digital Storefront <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">You can restart the process by refreshing the page.</p>
          </div>
        )
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      addMessage({ role: 'system', content: `An error occurred: ${errorMessage}` });
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setChatStep('results');
    }
  }, [productName, productDescription, productImageUri, toast]);
  

  return (
    <Card className="w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl rounded-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages} />
        {chatStep === 'image_setting' && (
          <ImageSettingOptions onSelect={runGeneration} />
        )}
      </div>
      <div className="border-t p-4 bg-card">
        <ChatInput
          onSendMessage={handleSendMessage}
          onUploadImage={handleImageUpload}
          isLoading={isLoading}
          step={chatStep}
        />
      </div>
    </Card>
  );
}
