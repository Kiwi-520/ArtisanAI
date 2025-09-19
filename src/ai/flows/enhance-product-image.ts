'use server';

/**
 * @fileOverview This flow enhances a product image by placing it in an appealing marketing setting using an image generation model.
 *
 * - enhanceProductImage - A function that takes a product image and a description, then enhances the image.
 * - EnhanceProductImageInput - The input type for the enhanceProductImage function.
 * - EnhanceProductImageOutput - The return type for the enhanceProductImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceProductImageInputSchema = z.object({
  productPhotoDataUri: z
    .string()
    .describe(
      'A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  settingDescription: z.string().describe('A description of the appealing marketing setting.'),
});
export type EnhanceProductImageInput = z.infer<typeof EnhanceProductImageInputSchema>;

const EnhanceProductImageOutputSchema = z.object({
  enhancedPhotoDataUri: z
    .string()
    .describe('The enhanced product photo as a data URI.'),
});
export type EnhanceProductImageOutput = z.infer<typeof EnhanceProductImageOutputSchema>;

export async function enhanceProductImage(
  input: EnhanceProductImageInput
): Promise<EnhanceProductImageOutput> {
  return enhanceProductImageFlow(input);
}

const enhanceProductImageFlow = ai.defineFlow(
  {
    name: 'enhanceProductImageFlow',
    inputSchema: EnhanceProductImageInputSchema,
    outputSchema: EnhanceProductImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.productPhotoDataUri}},
        {text: `generate an image of this product in ${input.settingDescription}`},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    if (!media) {
      throw new Error('No image was generated.');
    }

    return {enhancedPhotoDataUri: media.url};
  }
);
