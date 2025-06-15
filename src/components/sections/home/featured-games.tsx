
"use client";

import Image from 'next/image';
import Link from 'next/link'; 
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'embed'; // Added 'embed' type
  src: string; // URL for full image or video/content embed
  thumbnailSrc: string; // URL for thumbnail image
  alt: string;
  imageHint?: string; // For AI image search if using placeholders
}

// Export Game interface for reusability
export interface Game {
  id: string;
  title: string;
  subtitle?: string; 
  media: MediaItem[]; 
  // itchioEmbedUrl?: string | null; // Removed this field
  itchioPageUrl: string;
  buyNowUrl?: string; 
  logoUrl?: string; 
  description: string;
  isFeatured: boolean; 
  showInFeaturedGrid: boolean; 
  shortDescription?: string;
  shortDescriptionUnderGallery?: string; 
  heroTagline?: string;
  genres?: string[];
  platforms?: string[];
  releaseDate?: string;
  keyFeatures?: string[];
  developerNotes?: string;
  rating?: number; 
  ratingCount?: number; 
  customTags?: Array<{ 
    text: string;
    icon?: string; 
    iconColor?: string; 
  }>;
  priceDetails?: { 
    currencySymbol?: string;
    currentPrice: string;
    originalPrice?: string;
    discountPercentage?: string;
    baseGameTag?: string;
    saleEndDate?: string;
  };
  tabSections?: Array<{ 
    title: string;
    contentKey: keyof Game | 'media_plus_description' | string; 
  }>;
  // Deprecated fields, kept for potential data migration reference but should be consolidated into `media`
  imageUrl?: string; 
  imageHint?: string; 
  galleryImages?: Array<{ src: string; alt: string; imageHint: string }>; 
  trailerUrl?: string; 
}


interface FeaturedGamesProps {
  showAllGames?: boolean;
}

const GAMES_PER_CAROUSEL_VIEW = 3;
const TRANSITION_DURATION_MS = 500;

// Export GameCard for reusability
export function GameCard({ game }: { game: Game }) {
  const cardMedia = game.media && game.media.length > 0 ? game.media[0] : null;
  const imageUrl = cardMedia ? (cardMedia.thumbnailSrc || cardMedia.src) : (game.imageUrl || 'https://placehold.co/400x300.png');
  const imageHint = cardMedia ? cardMedia.imageHint : (game.imageHint || 'gameplay scene');


  return (
    <Link
      href={`/games/${game.id}`}
      className="group relative rounded-lg overflow-hidden shadow-xl cursor-pointer aspect-[4/3] h-full flex flex-col bg-card"
      aria-label={`View details for ${game.title}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={imageUrl}
          alt={game.title}
          data-ai-hint={imageHint}
          fill
          style={{objectFit:"cover"}}
          className="transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300 ease-in-out" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-snow-white">
        <h3 className="font-headline text-xl font-bold mb-1 text-shadow">{game.title}</h3>
        <p className="text-xs text-gray-300 mb-2 line-clamp-2">{game.shortDescription || game.description.substring(0,60)+'...'}</p>
        <Button variant="outline" size="sm" className="bg-transparent border-snow-white text-snow-white hover:bg-snow-white hover:text-charcoal text-xs pointer-events-none opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
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
          // On homepage "More Games" section, filter by showInFeaturedGrid
          const gridGames = jsonData.filter(game => game.showInFeaturedGrid);
          setGamesForDisplay(gridGames);
        } else {
          // On /games page, show all games (or could add a filter here too if needed)
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

  if (gamesForDisplay.length === 0 && !isLoading) {
     return <div className="text-center text-lg text-muted-foreground py-8">No games to display at the moment.</div>;
  }
  
  // Grid display for /games page or if carousel conditions aren't met for homepage section
  if (showAllGames || gamesForDisplay.length <= GAMES_PER_CAROUSEL_VIEW && !showAllGames) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
  
  // Carousel display for homepage "More Games" if enough games and not showAllGames
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
                className="flex-shrink-0 px-2" 
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
