
'use client';

import type { Recipe } from '@/ai/flows/suggest-recipes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';
import Image from 'next/image';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: () => void;
}

export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="relative aspect-video w-full -mt-6 -mx-6 mb-4">
             <Image src={recipe.imageUrl || `https://placehold.co/600x400.png`} alt={recipe.name} layout="fill" objectFit="cover" data-ai-hint="recipe food" />
        </div>
        <CardTitle className="font-headline text-2xl text-primary">{recipe.name}</CardTitle>
        <CardDescription className="font-body text-base">{recipe.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Intentionally blank to push footer down */}
      </CardContent>
      <CardFooter>
        <Button onClick={onSelect} className="w-full">
            <Utensils className="mr-2 h-4 w-4" />
            View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}
