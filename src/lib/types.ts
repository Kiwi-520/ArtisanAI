import type { GenerateMarketingNarrativeOutput } from '@/ai/flows/generate-marketing-narrative';
import type { EnhanceProductImageOutput } from '@/ai/flows/enhance-product-image';
import type { SimulateContentEngagementOutput } from '@/ai/flows/simulate-content-engagement';

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string | React.ReactNode;
};

export type ChatStep =
  | 'introduction'
  | 'product_name'
  | 'product_description'
  | 'product_image'
  | 'image_setting'
  | 'generating'
  | 'results';

export type StorefrontData = {
  productName: string;
  marketingNarrative: GenerateMarketingNarrativeOutput;
  enhancedImage: EnhanceProductImageOutput;
  engagementInsights: SimulateContentEngagementOutput;
};
