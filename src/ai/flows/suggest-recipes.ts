
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
  sourceURL: z.string().describe('A plausible but fake URL to an original recipe source.'),
  imagePrompt: z.string().describe('A short, descriptive prompt for an image generation model to create an appealing photo of the finished dish. For example: "A steaming bowl of chicken noodle soup".'),
  imageUrl: z.string().optional().describe('The URL of the generated image for the recipe.'),
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
For each recipe, provide a name, a short and enticing description (2-3 sentences), a list of ingredients with quantities, step-by-step instructions, a plausible but fake source URL from a popular recipe website like allrecipes.com or foodnetwork.com, and a prompt for an image generation model.

Ingredients: {{{ingredients}}}

Provide the output in the specified JSON format.`,
});


const generateImageFlow = ai.defineFlow(
  {
    name: 'generateRecipeImageFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return media.url;
  }
);


const suggestRecipesFlow = ai.defineFlow(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async input => {
    const {output} = await suggestRecipesPrompt(input);
    if (!output) {
      return { recipes: [] };
    }

    const imageGenerationPromises = output.recipes.map(recipe => 
      generateImageFlow(recipe.imagePrompt)
    );

    const imageUrls = await Promise.all(imageGenerationPromises);

    const recipesWithImages = output.recipes.map((recipe, index) => ({
      ...recipe,
      imageUrl: imageUrls[index],
    }));

    return { recipes: recipesWithImages };
  }
);
