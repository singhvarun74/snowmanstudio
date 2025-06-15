
"use client";

import Image from 'next/image';
import Link from 'next/link'; 
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Export Game interface for reusability
export interface Game {
  id: string;
  title: string;
  imageUrl: string;
  imageHint: string;
  itchioEmbedUrl?: string | null;
  itchioPageUrl: string;
  description: string;
  isFeatured: boolean;
  showInFeaturedGrid: boolean;
  shortDescription?: string;
  heroTagline?: string;
  // New fields for game detail page
  genres?: string[];
  platforms?: string[];
  releaseDate?: string;
  keyFeatures?: string[];
  galleryImages?: Array<{ src: string; alt: string; imageHint: string }>;
  trailerUrl?: string;
  developerNotes?: string;
}

interface FeaturedGamesProps {
  showAllGames?: boolean;
}

const GAMES_PER_CAROUSEL_VIEW = 3;
const TRANSITION_DURATION_MS = 500;

// Export GameCard for reusability
export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group relative rounded-lg overflow-hidden shadow-xl cursor-pointer aspect-[4/3] h-full flex flex-col"
      aria-label={`View details for ${game.title}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={game.imageUrl}
          alt={game.title}
          data-ai-hint={game.imageHint}
          fill
          style={{objectFit:"cover"}}
          className="transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-all duration-300 ease-in-out" />
      <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-snow-white
                      opacity-0 group-hover:opacity-100
                      transform translate-y-5 group-hover:translate-y-0
                      transition-all duration-300 ease-in-out">
        <h3 className="font-headline text-2xl font-bold mb-2 text-shadow">{game.title}</h3>
        <Button variant="outline" size="sm" className="bg-transparent border-snow-white text-snow-white hover:bg-snow-white hover:text-charcoal pointer-events-none">
          View Details
        </Button>
      </div>
    </Link>
  );
}


export default function FeaturedGames({ showAllGames = false }: FeaturedGamesProps) {
  const [allGamesData, setAllGamesData] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [gamesForDisplay, setGamesForDisplay] = useState<Game[]>([]);
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadGames() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/data/games.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.status}`);
        }
        const jsonData: Game[] = await response.json();
        setAllGamesData(jsonData);

        if (!showAllGames) {
          const gridGames = jsonData.filter(game => game.showInFeaturedGrid);
          setGamesForDisplay(gridGames);
        } else {
          setGamesForDisplay(jsonData);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching games.");
        }
        console.error("Error loading games:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadGames();
  }, [showAllGames]);

  const handleCarouselNav = (direction: 'next' | 'prev') => {
    if (!gamesForDisplay || gamesForDisplay.length <= GAMES_PER_CAROUSEL_VIEW) return;

    setCarouselCurrentIndex(prev => {
      let newIndex;
      const maxIndex = gamesForDisplay.length - GAMES_PER_CAROUSEL_VIEW;
      if (direction === 'next') {
        newIndex = Math.min(prev + 1, maxIndex);
      } else {
        newIndex = Math.max(prev - 1, 0);
      }
      return newIndex;
    });
  };

  if (isLoading) {
    const skeletonCount = showAllGames ? 6 : GAMES_PER_CAROUSEL_VIEW;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/3] h-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive bg-destructive/10 p-4 rounded-md">Error loading games: {error}</div>;
  }

  if (showAllGames || (gamesForDisplay.length === 0 && !isLoading)) {
     if (gamesForDisplay.length === 0) {
      return <div className="text-center text-lg text-muted-foreground py-8">No games to display at the moment.</div>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gamesForDisplay.map((game, index) => (
          <AnimateOnScroll
            key={game.id}
            animationClass="animate-slide-up-fade-in"
            delay={`delay-${index * 100}ms`}
            className="h-full"
          >
            <GameCard game={game} />
          </AnimateOnScroll>
        ))}
      </div>
    );
  }
  
  const canNavigatePrev = carouselCurrentIndex > 0;
  const canNavigateNext = carouselCurrentIndex < gamesForDisplay.length - GAMES_PER_CAROUSEL_VIEW;
  const showNavigationArrows = gamesForDisplay.length > GAMES_PER_CAROUSEL_VIEW;

  return (
    <AnimateOnScroll animationClass="animate-fade-in-from-bottom">
      <div className="relative">
        {showNavigationArrows && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-full z-10 bg-card/80 hover:bg-card border-primary text-primary rounded-full h-10 w-10 md:h-12 md:w-12 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleCarouselNav('prev')}
              aria-label="Previous featured games"
              disabled={!canNavigatePrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-full z-10 bg-card/80 hover:bg-card border-primary text-primary rounded-full h-10 w-10 md:h-12 md:w-12 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleCarouselNav('next')}
              aria-label="Next featured games"
              disabled={!canNavigateNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex"
            style={{
              transform: `translateX(-${carouselCurrentIndex * (100 / GAMES_PER_CAROUSEL_VIEW)}%)`,
              transition: `transform ${TRANSITION_DURATION_MS}ms ease-in-out`,
            }}
          >
            {gamesForDisplay.map((game) => (
              <div
                key={game.id}
                className="flex-shrink-0 px-4" 
                style={{
                  flexBasis: `calc(100% / ${GAMES_PER_CAROUSEL_VIEW})`,
                }}
              >
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}

