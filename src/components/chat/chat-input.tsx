'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, LoaderCircle } from 'lucide-react';
import type { ChatStep } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  onUploadImage: (file: File) => void;
  isLoading: boolean;
  step: ChatStep;
};

export function ChatInput({ onSendMessage, onUploadImage, isLoading, step }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isTextInputDisabled = step === 'product_image' || step === 'image_setting' || step === 'generating' || step === 'results';
  const isUploadDisabled = step !== 'product_image' || isLoading;

  const handleSubmit = () => {
    if (message.trim() && !isTextInputDisabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  return (
    <div className="flex items-start gap-2 sm:gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadDisabled}
              aria-label="Upload Image"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload Product Image</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        disabled={isUploadDisabled}
      />

      <div className="relative w-full">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isTextInputDisabled
              ? 'Please follow the steps above'
              : 'Type your message here...'
          }
          className="pr-20 min-h-[40px] resize-none"
          rows={1}
          disabled={isTextInputDisabled || isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-16"
          onClick={handleSubmit}
          disabled={isTextInputDisabled || isLoading || !message.trim()}
        >
          {isLoading && step === 'generating' ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
