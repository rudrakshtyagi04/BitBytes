
'use client';

import type { Recipe } from '@/ai/flows/suggest-recipes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Link as LinkIcon, CheckCircle2, Circle } from 'lucide-react';
import Image from 'next/image';

interface RecipeDetailProps {
  recipe: Recipe | null;
  onOpenChange: (open: boolean) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export function RecipeDetail({ recipe, onOpenChange, isSaved, onToggleSave }: RecipeDetailProps) {
  if (!recipe) return null;

  return (
    <Dialog open={!!recipe} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col p-0">
        <ScrollArea className="flex-grow">
        <div className="relative h-64 w-full">
          <Image src={recipe.imageUrl || `https://placehold.co/600x400.png`} alt={recipe.name} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint="recipe dinner" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <DialogTitle className="font-headline text-3xl text-white">{recipe.name}</DialogTitle>
          </div>
        </div>
          <div className="p-6">
            <DialogDescription className="font-body text-base mb-6 text-foreground">{recipe.description}</DialogDescription>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-headline text-xl text-primary mb-3">Ingredients</h3>
                    <ul className="space-y-2">
                        {recipe.ingredients.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 font-body">
                           <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                           <span>{item}</span>
                        </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <Button onClick={onToggleSave} className="w-full mb-4">
                        <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                        {isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
                    </Button>
                    <a href={recipe.sourceURL} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="outline" className="w-full">
                            <LinkIcon className="mr-2 h-4 w-4" />
                            View Original Source
                        </Button>
                    </a>
                </div>
            </div>

            <div className="mt-6">
              <h3 className="font-headline text-xl text-primary mb-3">Instructions</h3>
              <ol className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 font-body">
                    <div className="flex-shrink-0 mt-1 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{i + 1}</div>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
