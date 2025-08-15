
'use client';

import { useState } from 'react';
import type { Recipe } from '@/ai/flows/suggest-recipes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bookmark, ChefHat, Trash2, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

interface AppHeaderProps {
  savedRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveRecipe: (recipeName: string) => void;
}

export function AppHeader({ savedRecipes, onSelectRecipe, onRemoveRecipe }: AppHeaderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSelectRecipe = (recipe: Recipe) => {
    onSelectRecipe(recipe);
    setIsSheetOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-primary">ByteBites</h1>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Bookmark className="mr-2 h-4 w-4" />
              Saved Recipes ({savedRecipes.length})
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md flex flex-col">
            <SheetHeader>
              <SheetTitle className="font-headline text-2xl">Saved Recipes</SheetTitle>
              <SheetDescription>Your favorite recipes are just a click away.</SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-grow my-4">
              <div className="pr-4">
                {savedRecipes.length > 0 ? (
                  <ul className="space-y-4">
                    {savedRecipes.map((recipe, index) => (
                      <li key={index} className="flex items-start gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                           <Image src={recipe.imageUrl || `https://placehold.co/100x100.png`} alt={recipe.name} layout="fill" objectFit="cover" data-ai-hint="recipe food" />
                        </div>
                        <div className="flex-grow">
                          <button onClick={() => handleSelectRecipe(recipe)} className="text-left">
                            <h3 className="font-semibold font-headline text-primary hover:underline">{recipe.name}</h3>
                          </button>
                          <p className="text-sm text-muted-foreground line-clamp-2 font-body">{recipe.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8" onClick={() => onRemoveRecipe(recipe.name)}>
                           <Trash2 className="h-4 w-4 text-destructive" />
                           <span className="sr-only">Remove recipe</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted-foreground py-16">
                    <Bookmark className="mx-auto h-12 w-12" />
                    <p className="mt-4">You haven't saved any recipes yet.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
