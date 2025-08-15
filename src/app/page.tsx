
'use client';

import { useState, useMemo } from 'react';
import type { Recipe } from '@/ai/flows/suggest-recipes';
import { suggestRecipes } from '@/ai/flows/suggest-recipes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { RecipeCard } from '@/components/recipe-card';
import { RecipeDetail } from '@/components/recipe-detail';
import { AppHeader } from '@/components/header';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sparkles, Soup, AlertTriangle } from 'lucide-react';

export default function ByteBitesPage() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useLocalStorage<Recipe[]>('bytebites-saved', []);

  const handleSuggestRecipes = async () => {
    if (!ingredients.trim()) {
      setError('Please enter some ingredients.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    try {
      const result = await suggestRecipes({ ingredients });
      setRecipes(result.recipes);
    } catch (e) {
      setError('Could not find recipes. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const isRecipeSaved = useMemo(() => {
    if (!selectedRecipe) return false;
    return savedRecipes.some(r => r.name === selectedRecipe.name);
  }, [selectedRecipe, savedRecipes]);

  const toggleSaveRecipe = () => {
    if (!selectedRecipe) return;
    if (isRecipeSaved) {
      setSavedRecipes(savedRecipes.filter(r => r.name !== selectedRecipe.name));
    } else {
      setSavedRecipes([...savedRecipes, selectedRecipe]);
    }
  };
  
  const removeFromSaved = (recipeName: string) => {
    setSavedRecipes(savedRecipes.filter(r => r.name !== recipeName));
  }


  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader savedRecipes={savedRecipes} onSelectRecipe={setSelectedRecipe} onRemoveRecipe={removeFromSaved} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-headline text-primary mb-4">Find Your Next Meal</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Enter the ingredients you have on hand, and let our AI chef whip up some delicious recipe ideas for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
            <Textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., chicken breast, broccoli, garlic, olive oil"
              className="flex-grow resize-none"
              rows={2}
            />
            <Button
              onClick={handleSuggestRecipes}
              disabled={isLoading}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isLoading ? 'Finding...' : 'Find Recipes'}
            </Button>
          </div>
        </section>

        <section className="mt-12">
          {error && (
             <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 p-6 rounded-lg border bg-card">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && recipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  onSelect={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          )}

          {!isLoading && !error && recipes.length === 0 && (
             <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg max-w-2xl mx-auto">
                <Soup className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">Welcome to ByteBites!</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Your culinary adventure starts here. Enter some ingredients above to get started.
                </p>
            </div>
          )}
        </section>
      </main>
      <RecipeDetail 
        recipe={selectedRecipe} 
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
        isSaved={isRecipeSaved}
        onToggleSave={toggleSaveRecipe}
      />
    </div>
  );
}
