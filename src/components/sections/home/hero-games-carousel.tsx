
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

// Re-use Game interface, assuming it might be moved to a shared types file later
// For now, ensure it matches the one in featured-games.tsx if fields are added/changed.
interface Game {
  id: string;
  title: string;
  imageUrl: string;
  imageHint: string;
  itchioPageUrl: string; 
  description: string;
  isFeatured: boolean;
  showInFeaturedGrid?: boolean;
  shortDescription?: string;
  heroTagline?: string;
  itchioEmbedUrl?: string | null;
  // New fields (optional)
  genres?: string[];
  platforms?: string[];
  releaseDate?: string;
  keyFeatures?: string[];
  galleryImages?: Array<{ src: string; alt: string; imageHint: string; }>;
  trailerUrl?: string;
  developerNotes?: string;
}

const AUTO_CYCLE_INTERVAL = 7000; // 7 seconds

export default function HeroGamesCarousel() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
        const featuredGames = jsonData.filter(game => game.isFeatured);
        setGames(featuredGames);
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
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (games.length || 1));
  }, [games.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
  };

  const selectGame = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true); 
    setTimeout(() => setIsPaused(false), AUTO_CYCLE_INTERVAL * 2); 
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    if (games.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, AUTO_CYCLE_INTERVAL);

    return () => clearInterval(timer);
  }, [games.length, handleNext, isPaused]);


  if (isLoading) {
    return (
      <section className="relative w-full bg-card text-card-foreground py-8 md:py-12 lg:py-16 min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-10 gap-8 items-center">
            <div className="md:col-span-4 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-40" />
            </div>
            <div className="md:col-span-6">
              <Skeleton className="w-full aspect-video rounded-lg" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-md" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <section className="py-12 text-center text-destructive">Error: {error}</section>;
  }

  if (games.length === 0) {
    return <section className="py-12 text-center text-muted-foreground">No featured games available.</section>;
  }

  const activeGame = games[currentIndex];

  return (
    <section className="relative w-full bg-card text-card-foreground py-8 md:py-12 lg:py-16 min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-10 gap-6 md:gap-8 items-center mb-8">
          <div className="md:col-span-4 flex flex-col justify-center space-y-3 md:space-y-5 order-2 md:order-1">
            <p className="text-sm uppercase tracking-wider text-primary font-semibold">{activeGame.title}</p>
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {activeGame.heroTagline || `Experience ${activeGame.title}`}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md">
              {activeGame.shortDescription || (activeGame.description ? activeGame.description.substring(0, 150) + "..." : "")}
            </p>
            <div className="pt-2">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform duration-150 ease-out hover:scale-105 shadow-lg">
                <Link href={`/games/${activeGame.id}`}> 
                  View Game
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:col-span-6 order-1 md:order-2 group relative">
             <Link href={`/games/${activeGame.id}`} className="relative aspect-video rounded-lg overflow-hidden shadow-2xl block">
                {games.map((game, idx) => (
                    <Image
                        key={game.id}
                        src={game.imageUrl}
                        alt={game.title}
                        data-ai-hint={game.imageHint || "gameplay scene"}
                        fill
                        style={{objectFit:"cover"}}
                        quality={85}
                        priority={idx === currentIndex}
                        className={cn(
                        "transition-opacity duration-1000 ease-in-out absolute inset-0",
                        idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        )}
                    />
                ))}
            </Link>
             {games.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/50 hover:bg-background/80 text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous Game"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/50 hover:bg-background/80 text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next Game"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>

        {games.length > 1 && (
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {games.map((game, idx) => (
                <button // Changed Link to button for selectGame behavior, navigation happens via Hero image/button
                  key={game.id}
                  onClick={() => selectGame(idx)} 
                  className={cn(
                    "relative aspect-video rounded-md overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card transition-all duration-300 ease-in-out cursor-pointer",
                    idx === currentIndex ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-105" : "opacity-70 hover:opacity-100 hover:scale-105"
                  )}
                  aria-label={`Select game: ${game.title}`}
                >
                  <Image
                    src={game.imageUrl}
                    alt={game.title}
                    data-ai-hint={game.imageHint || "game thumbnail"}
                    fill
                    style={{objectFit:"cover"}}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  {idx === currentIndex && !isPaused && (
                     <div className="absolute bottom-1 left-1 right-1 p-1 ">
                        <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                           <div 
                            className="h-full bg-primary"
                            style={{ animation: `progress ${AUTO_CYCLE_INTERVAL}ms linear`}} 
                            onAnimationEnd={handleNext} 
                            ></div>
                        </div>
                    </div>
                  )}
                   <div className="absolute bottom-1 left-1 right-1 p-1.5 text-center">
                    <p className="text-xs font-medium text-snow-white truncate group-hover:text-primary transition-colors">
                      {game.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
             <button 
                onClick={togglePause} 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+4rem)] md:-translate-y-[calc(50%+5rem)] z-30 p-2 bg-card/70 hover:bg-card text-foreground rounded-full shadow-lg transition-opacity opacity-60 hover:opacity-100"
                aria-label={isPaused ? "Play auto-cycle" : "Pause auto-cycle"}
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </button>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}

