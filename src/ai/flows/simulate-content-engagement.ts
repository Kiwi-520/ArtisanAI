'use server';

/**
 * @fileOverview Simulates user engagement with content to suggest content styles for better performance.
 *
 * - simulateContentEngagement - Simulates user engagement and suggests content styles.
 * - SimulateContentEngagementInput - The input type for the simulateContentEngagement function.
 * - SimulateContentEngagementOutput - The return type for the simulateContentEngagement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateContentEngagementInputSchema = z.object({
  content: z.string().describe('The content to simulate engagement with.'),
  stylePreferences: z.string().optional().describe('Optional style preferences for the content.'),
});
export type SimulateContentEngagementInput = z.infer<typeof SimulateContentEngagementInputSchema>;

const SimulateContentEngagementOutputSchema = z.object({
  suggestedStyles: z.string().describe('Suggested content styles based on simulated user engagement.'),
  engagementScore: z.number().describe('A score representing the simulated user engagement (0-1).'),
});
export type SimulateContentEngagementOutput = z.infer<typeof SimulateContentEngagementOutputSchema>;

export async function simulateContentEngagement(
  input: SimulateContentEngagementInput
): Promise<SimulateContentEngagementOutput> {
  return simulateContentEngagementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateContentEngagementPrompt',
  input: {schema: SimulateContentEngagementInputSchema},
  output: {schema: SimulateContentEngagementOutputSchema},
  prompt: `You are a marketing expert analyzing content engagement.

  Based on the content provided and optional style preferences, simulate user engagement and suggest content styles to improve performance.

  Content: {{{content}}}
  Style Preferences: {{{stylePreferences}}}

  Consider factors like readability, emotional impact, and relevance to the target audience.

  Provide a engagementScore to represent how likely the content is to do well. Then suggest 1 to 3 styles to improve the content.
  `,
});

const simulateContentEngagementFlow = ai.defineFlow(
  {
    name: 'simulateContentEngagementFlow',
    inputSchema: SimulateContentEngagementInputSchema,
    outputSchema: SimulateContentEngagementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
