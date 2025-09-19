'use client';

import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

type ImageSettingOptionsProps = {
  onSelect: (setting: string) => void;
};

const settings = [
  'On a rustic wooden table with soft, warm lighting',
  'In a minimalist white studio with clean shadows',
  'On a cozy coffee shop counter next to a latte',
  'Displayed in a modern art gallery setting',
  'Against a backdrop of lush, natural greenery',
];

export function ImageSettingOptions({ onSelect }: ImageSettingOptionsProps) {
  return (
    <div className="px-4 sm:px-6 pb-4 ml-12">
      <div className="max-w-md lg:max-w-lg space-y-2">
        {settings.map((setting) => (
          <Button
            key={setting}
            variant="outline"
            className="w-full justify-start text-left h-auto py-2"
            onClick={() => onSelect(setting)}
          >
            <Wand2 className="w-4 h-4 mr-3 shrink-0" />
            <span>{setting}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
