'use server';

import { generateMarketingNarrative } from '@/ai/flows/generate-marketing-narrative';
import { enhanceProductImage } from '@/ai/flows/enhance-product-image';
import { simulateContentEngagement } from '@/ai/flows/simulate-content-engagement';
import type { StorefrontData } from '@/lib/types';

export async function generateStorefrontContent(
  productName: string,
  productDescription: string,
  productPhotoDataUri: string,
  settingDescription: string
): Promise<StorefrontData> {
  try {
    const marketingNarrativePromise = generateMarketingNarrative({
      productDescription,
      productPhotoDataUri,
    });

    const enhancedImagePromise = enhanceProductImage({
      productPhotoDataUri,
      settingDescription,
    });

    const [marketingNarrative, enhancedImage] = await Promise.all([
      marketingNarrativePromise,
      enhancedImagePromise,
    ]);

    const engagementContent = `${marketingNarrative.productDescription} ${marketingNarrative.shortStory} ${marketingNarrative.socialMediaContent}`;
    const engagementInsights = await simulateContentEngagement({
      content: engagementContent,
    });

    return {
      productName,
      marketingNarrative,
      enhancedImage,
      engagementInsights,
    };
  } catch (error) {
    console.error('Error generating storefront content:', error);
    // It's better to throw a generic error to the client
    throw new Error('Failed to generate AI content. Please check the inputs and try again.');
  }
}
