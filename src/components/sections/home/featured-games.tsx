
"use client";

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Game {
  id: string;
  title: string;
  imageUrl: string;
  imageHint: string;
  itchioEmbedUrl?: string | null;
  itchioPageUrl: string;
  description: string;
  isFeatured: boolean;
}

interface FeaturedGamesProps {
  showAllGames?: boolean;
}

const GAMES_PER_CAROUSEL_VIEW = 3;
const TRANSITION_DURATION_MS = 500; // For CSS transition

export default function FeaturedGames({ showAllGames = false }: FeaturedGamesProps) {
  const [allGamesData, setAllGamesData] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [featuredGamesList, setFeaturedGamesList] = useState<Game[]>([]);
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
          const featured = jsonData.filter(game => game.isFeatured);
          setFeaturedGamesList(featured);
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
    if (!featuredGamesList || featuredGamesList.length <= GAMES_PER_CAROUSEL_VIEW) return;

    setCarouselCurrentIndex(prev => {
      let newIndex;
      const maxIndex = featuredGamesList.length - GAMES_PER_CAROUSEL_VIEW;
      if (direction === 'next') {
        newIndex = Math.min(prev + 1, maxIndex);
      } else { // prev
        newIndex = Math.max(prev - 1, 0);
      }
      return newIndex;
    });
  };

  const handleCardClick = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
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

  if (showAllGames) {
    if (allGamesData.length === 0) {
      return <div className="text-center text-lg text-muted-foreground py-8">No games to display at the moment.</div>;
    }
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allGamesData.map((game, index) => (
            <AnimateOnScroll
              key={game.id}
              animationClass="animate-slide-up-fade-in"
              delay={`delay-${index * 100}ms`}
              className="h-full"
            >
              <GameCard game={game} onClick={() => handleCardClick(game)} />
            </AnimateOnScroll>
          ))}
        </div>
        <GameModal selectedGame={selectedGame} isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </>
    );
  }

  if (featuredGamesList.length === 0 && !isLoading) {
    return <div className="text-center text-lg text-muted-foreground py-8">No featured games to display at the moment.</div>;
  }

  const canNavigatePrev = carouselCurrentIndex > 0;
  const canNavigateNext = carouselCurrentIndex < featuredGamesList.length - GAMES_PER_CAROUSEL_VIEW;
  const showNavigationArrows = featuredGamesList.length > GAMES_PER_CAROUSEL_VIEW;

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
            {featuredGamesList.map((game) => (
              <div
                key={game.id}
                className="flex-shrink-0 px-4" // px-4 creates 1rem padding on each side, effective 2rem (gap-8) between cards
                style={{
                  flexBasis: `calc(100% / ${GAMES_PER_CAROUSEL_VIEW})`,
                }}
              >
                <GameCard game={game} onClick={() => handleCardClick(game)} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <GameModal selectedGame={selectedGame} isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </AnimateOnScroll>
  );
}

interface GameCardProps {
  game: Game;
  onClick: () => void;
}
function GameCard({ game, onClick }: GameCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-lg overflow-hidden shadow-xl cursor-pointer aspect-[4/3] h-full flex flex-col"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick();}}
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
        <Button variant="outline" size="sm" className="bg-transparent border-snow-white text-snow-white hover:bg-snow-white hover:text-charcoal">
          View Details
        </Button>
      </div>
    </div>
  );
}

interface GameModalProps {
  selectedGame: Game | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
function GameModal({ selectedGame, isOpen, onOpenChange }: GameModalProps) {
  if (!selectedGame) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[800px] p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-headline text-3xl text-primary">{selectedGame.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="p-6 pt-0 overflow-y-auto flex-grow">
          {selectedGame.itchioEmbedUrl ? (
            <div className="aspect-video">
              <iframe
                src={selectedGame.itchioEmbedUrl}
                frameBorder="0"
                className="w-full h-full rounded-md"
                allowFullScreen
                title={`${selectedGame.title} Itch.io Embed`}
              />
            </div>
          ) : (
            <>
              <div className="relative w-full aspect-video mb-4 rounded-md overflow-hidden">
                 <Image src={selectedGame.imageUrl} alt={selectedGame.title} data-ai-hint={selectedGame.imageHint} fill style={{objectFit:"cover"}} />
              </div>
              <p className="mb-6 text-base text-foreground leading-relaxed">{selectedGame.description}</p>
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-opacity-80 py-3 text-lg">
                <a href={selectedGame.itchioPageUrl} target="_blank" rel="noopener noreferrer">
                  Play on Itch.io <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
