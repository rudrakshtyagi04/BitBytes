
'use server';

/**
 * @fileOverview Provides recipe suggestions based on a list of ingredients.
 *
 * - suggestRecipes - A function that takes a list of ingredients and returns recipe suggestions.
 * - SuggestRecipesInput - The input type for the suggestRecipes function, a list of ingredients.
 * - SuggestRecipesOutput - The return type for the suggestRecipes function, a list of recipe suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipesInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients the user has available.'),
});
export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const RecipeSchema = z.object({
    name: z.string().describe('The name of the recipe.'),
    description: z.string().describe('A brief, enticing description of the recipe.'),
    ingredients: z.array(z.string()).describe('A list of ingredients required for the recipe, including quantities.'),
    instructions: z.array(z.string()).describe('Step-by-step preparation instructions.'),
    sourceURL: z.string().url().describe('A plausible but fake URL to an original recipe source.'),
});

export type Recipe = z.infer<typeof RecipeSchema>;

const SuggestRecipesOutputSchema = z.object({
  recipes: z
    .array(RecipeSchema)
    .describe('A list of 3-5 suggested recipes based on the available ingredients.'),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(input: SuggestRecipesInput): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const suggestRecipesPrompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {schema: SuggestRecipesInputSchema},
  output: {schema: SuggestRecipesOutputSchema},
  prompt: `You are a recipe suggestion AI called RecipeAce.

You will be provided with a list of ingredients that a user has available, and you will suggest 3-5 recipes that the user can make with those ingredients.
For each recipe, provide a name, a short and enticing description (2-3 sentences), a list of ingredients with quantities, step-by-step instructions, and a plausible but fake source URL from a popular recipe website like allrecipes.com or foodnetwork.com.

Ingredients: {{{ingredients}}}

Provide the output in the specified JSON format.`,
});

const suggestRecipesFlow = ai.defineFlow(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async input => {
    const {output} = await suggestRecipesPrompt(input);
    return output!;
  }
);
