'use server';

/**
 * @fileOverview Generates a marketing narrative for a product based on a description and image.
 *
 * - generateMarketingNarrative - A function that generates the marketing narrative.
 * - GenerateMarketingNarrativeInput - The input type for the generateMarketingNarrative function.
 * - GenerateMarketingNarrativeOutput - The return type for the generateMarketingNarrative function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingNarrativeInputSchema = z.object({
  productDescription: z.string().describe('The description of the product.'),
  productPhotoDataUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type GenerateMarketingNarrativeInput = z.infer<typeof GenerateMarketingNarrativeInputSchema>;

const GenerateMarketingNarrativeOutputSchema = z.object({
  productDescription: z.string().describe('AI-generated enhanced product description.'),
  shortStory: z.string().describe('A short story featuring the product.'),
  socialMediaContent: z.string().describe('Social media content promoting the product.'),
});
export type GenerateMarketingNarrativeOutput = z.infer<typeof GenerateMarketingNarrativeOutputSchema>;

export async function generateMarketingNarrative(
  input: GenerateMarketingNarrativeInput
): Promise<GenerateMarketingNarrativeOutput> {
  return generateMarketingNarrativeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketingNarrativePrompt',
  input: {schema: GenerateMarketingNarrativeInputSchema},
  output: {schema: GenerateMarketingNarrativeOutputSchema},
  prompt: `You are a marketing expert specializing in crafting compelling narratives for artisans.

  Given the following product description and image, generate:

  1.  An enhanced product description that highlights the unique qualities and benefits of the product.
  2.  A short story that features the product in an engaging and imaginative way.
  3.  Social media content (e.g., a tweet, an Instagram caption, a Facebook post) designed to promote the product.

  Product Description: {{{productDescription}}}
  Product Image: {{media url=productPhotoDataUri}}
  \n  Ensure each piece of content is distinct and tailored to its respective purpose.
  \n  Ensure that all content is less than 280 characters.
  `, 
});

const generateMarketingNarrativeFlow = ai.defineFlow(
  {
    name: 'generateMarketingNarrativeFlow',
    inputSchema: GenerateMarketingNarrativeInputSchema,
    outputSchema: GenerateMarketingNarrativeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
