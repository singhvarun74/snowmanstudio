
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense, useEffect, useState, type ReactNode, use } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import { GameCard, type Game, type MediaItem } from '@/components/sections/home/featured-games';
import {
  ChevronLeft, ChevronRight, Star, ListChecks, Gamepad2, CalendarDays, Film,
  GalleryHorizontal, Tag, ShoppingCart, Heart, DownloadCloud, Info, HelpCircle, Trophy, Play
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

async function getGameById(id: string): Promise<Game | undefined> {
  try {
    const response = await fetch('/data/games.json'); // Use relative path
    if (!response.ok) {
      console.error(`Failed to fetch games.json: ${response.status}`);
      return undefined;
    }
    const games: Game[] = await response.json();
    return games.find(game => game.id === id);
  } catch (error) {
    console.error("Error fetching or parsing games.json:", error);
    return undefined;
  }
}

async function getOtherGames(currentId: string, count: number = 4): Promise<Game[]> {
  try {
    const response = await fetch('/data/games.json'); // Use relative path
     if (!response.ok) {
      console.error(`Failed to fetch games.json for other games: ${response.status}`);
      return [];
    }
    const games: Game[] = await response.json();
    return games.filter(game => game.id !== currentId).slice(0, count);
  } catch (error) {
    console.error("Error fetching or parsing games.json for other games:", error);
    return [];
  }
}

const RatingStars: React.FC<{ rating?: number; maxStars?: number }> = ({ rating = 0, maxStars = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
      {halfStar && <Star key="half" className="h-4 w-4 text-yellow-400 fill-yellow-200" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
      ))}
    </div>
  );
};

const CustomTag: React.FC<{ tag: NonNullable<Game["customTags"]>[0] }> = ({ tag }) => {
  const icons: { [key: string]: React.ElementType } = {
    Gamepad2, ListChecks, Film, GalleryHorizontal, Tag, Trophy, DownloadCloud, HelpCircle, Info
  };
  const ActualIcon = tag.icon && icons[tag.icon] ? icons[tag.icon] : Info;

  return (
    <Badge variant="secondary" className="flex items-center gap-1.5 py-1 px-2 text-xs bg-muted hover:bg-muted/80">
       <ActualIcon className={cn("h-3.5 w-3.5", tag.iconColor || "text-muted-foreground")} />
      <span>{tag.text}</span>
    </Badge>
  );
};

interface GameMediaViewerProps {
  media: MediaItem[];
  gameTitle: string;
}

const GameMediaViewer: React.FC<GameMediaViewerProps> = ({ media, gameTitle }) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  if (!media || media.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        No media available.
      </div>
    );
  }

  const selectedMedia = media[selectedMediaIndex];

  const handleThumbnailClick = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const handlePrev = () => {
    setSelectedMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg bg-black">
        {selectedMedia.type === 'video' && selectedMedia.src.includes('youtube.com/embed') ? (
          <iframe
            src={selectedMedia.src}
            title={`${gameTitle} - ${selectedMedia.alt || 'Trailer'}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        ) : selectedMedia.type === 'embed' ? (
           <iframe
            src={selectedMedia.src}
            title={`${gameTitle} - ${selectedMedia.alt || 'Embed'}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <Image
            src={selectedMedia.src}
            alt={selectedMedia.alt || `${gameTitle} - Media ${selectedMediaIndex + 1}`}
            data-ai-hint={selectedMedia.imageHint}
            fill
            style={{objectFit:"contain"}}
            priority={selectedMediaIndex === 0}
            sizes="(max-width: 768px) 100vw, 70vw"
          />
        )}
      </div>

      {media.length > 1 && (
        <div className="relative mt-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card/70 hover:bg-card h-8 w-8 -ml-3"
            aria-label="Previous media"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="overflow-x-auto hide-scrollbar px-8 py-2">
            <div className="flex space-x-2 w-max">
              {media.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleThumbnailClick(index)}
                  className={cn(
                    "relative aspect-video w-24 h-auto rounded overflow-hidden border-2 focus:outline-none transition-all duration-150",
                    index === selectedMediaIndex ? "border-primary scale-105" : "border-transparent hover:border-muted"
                  )}
                  aria-label={`View media ${index + 1}: ${item.alt || item.type}`}
                >
                  <Image
                    src={item.thumbnailSrc || item.src}
                    alt={item.alt || `Thumbnail ${index + 1}`}
                    data-ai-hint={item.imageHint}
                    fill
                    style={{objectFit:"cover"}}
                    sizes="100px"
                  />
                  {(item.type === 'video' || item.type === 'embed') && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card/70 hover:bg-card h-8 w-8 -mr-3"
            aria-label="Next media"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};


function GameDetailPageContent({ game, otherGames }: { game: Game; otherGames: Game[] }) {
  const currencySymbol = game.priceDetails?.currencySymbol || '₹';

  return (
    <div className="container mx-auto px-4 py-8 pt-24 md:pt-32">
      <AnimateOnScroll animationClass="animate-fade-in-from-bottom" className="mb-6">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
          {game.title}
          {game.subtitle && <span className="text-2xl md:text-3xl text-muted-foreground ml-2">{game.subtitle}</span>}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
          {game.rating !== undefined && (
            <div className="flex items-center gap-1.5">
              <RatingStars rating={game.rating} />
              <span className="text-sm font-medium text-foreground">{game.rating.toFixed(1)}</span>
              {game.ratingCount && <span className="text-xs text-muted-foreground">({game.ratingCount} ratings)</span>}
            </div>
          )}
          {game.customTags && game.customTags.map((tag, index) => (
            <CustomTag key={index} tag={tag} />
          ))}
        </div>
      </AnimateOnScroll>

      <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8">
          <Tabs defaultValue={game.tabSections?.[0]?.title.toLowerCase() || "overview"} className="w-full">
            <TabsList className="border-b border-border rounded-none p-0 bg-transparent mb-6 justify-start">
              {(game.tabSections || [{ title: "Overview", contentKey: "media_plus_description" }]).map((tab) => (
                <TabsTrigger
                  key={tab.title.toLowerCase()}
                  value={tab.title.toLowerCase()}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none px-4 py-2 text-base text-muted-foreground hover:text-foreground transition-none"
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview">
              <AnimateOnScroll animationClass="animate-fade-in-from-bottom" delay="delay-100ms" className="space-y-6">
                {game.media && game.media.length > 0 && (
                  <GameMediaViewer media={game.media} gameTitle={game.title} />
                )}
                {game.shortDescriptionUnderGallery && (
                  <p className="text-lg text-foreground leading-relaxed mt-4">
                    {game.shortDescriptionUnderGallery}
                  </p>
                )}
                 {game.description && (
                  <Card className="shadow-none border-none bg-transparent p-0">
                    <CardContent className="p-0">
                      <p className="text-foreground/90 leading-relaxed whitespace-pre-line text-sm">
                        {game.description}
                      </p>
                    </CardContent>
                  </Card>
                )}
                {game.keyFeatures && game.keyFeatures.length > 0 && (
                  <Card className="shadow-none border-none bg-transparent p-0">
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-xl font-semibold text-primary flex items-center">
                        <ListChecks className="mr-2 h-5 w-5" /> Key Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="list-disc list-inside space-y-1.5 text-foreground/90 text-sm">
                        {game.keyFeatures.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </AnimateOnScroll>
            </TabsContent>

            <TabsContent value="add-ons">
              <Card>
                <CardHeader><CardTitle>Add-Ons</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Content for Add-Ons will be displayed here. Update `games.json` to populate this section.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Content for Achievements will be displayed here. Update `games.json` to populate this section.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-4">
          <AnimateOnScroll animationClass="animate-fade-in-from-bottom" delay="delay-200ms" className="sticky top-24 space-y-6">
            {game.logoUrl && (
              <div className="relative aspect-[2/1] w-full max-w-xs mx-auto lg:mx-0 mb-4">
                 <Image src={game.logoUrl} alt={`${game.title} Logo`} fill style={{objectFit:"contain"}} data-ai-hint="game logo" />
              </div>
            )}

            <Card className="shadow-xl bg-card p-4 rounded-lg">
              <CardContent className="space-y-4 p-0">
                {game.priceDetails?.baseGameTag && (
                  <Badge variant="secondary" className="text-xs">{game.priceDetails.baseGameTag}</Badge>
                )}

                <div className="flex items-baseline gap-2 flex-wrap">
                  {game.priceDetails?.discountPercentage && (
                    <Badge className="bg-primary hover:bg-primary/90 text-base font-bold py-1 px-2.5">
                      -{game.priceDetails.discountPercentage}
                    </Badge>
                  )}
                  {game.priceDetails?.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {currencySymbol}{game.priceDetails.originalPrice}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-foreground">
                    {currencySymbol}{game.priceDetails?.currentPrice || 'N/A'}
                  </span>
                </div>

                {game.priceDetails?.saleEndDate && (
                  <p className="text-xs text-muted-foreground">{game.priceDetails.saleEndDate}</p>
                )}

                <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/80 py-3 text-lg font-semibold transition-all duration-150 ease-out hover:scale-105 shadow-md mt-2">
                  <Link href={game.buyNowUrl || game.itchioPageUrl} target="_blank" rel="noopener noreferrer">
                    Buy Now
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" className="w-full bg-muted hover:bg-muted/80 text-foreground py-3 text-lg font-semibold transition-all duration-150 ease-out hover:scale-105 shadow-sm">
                  Add To Cart
                </Button>
                <Button variant="outline" size="lg" className="w-full border-muted hover:bg-muted/50 text-foreground py-3 text-lg font-semibold transition-all duration-150 ease-out hover:scale-105 shadow-sm">
                  Add to Wishlist
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-none border bg-card p-4 rounded-lg">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-lg text-primary">Game Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-0 text-sm">
                {game.genres && game.genres.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-1.5 flex items-center"><Tag className="mr-2 h-4 w-4" />Genres</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {game.genres.map(genre => <Badge key={genre} variant="outline" className="text-xs">{genre}</Badge>)}
                    </div>
                  </div>
                )}
                {game.platforms && game.platforms.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-1.5 flex items-center"><Gamepad2 className="mr-2 h-4 w-4" />Platforms</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {game.platforms.map(platform => <Badge key={platform} variant="outline" className="text-xs">{platform}</Badge>)}
                    </div>
                  </div>
                )}
                {game.releaseDate && (
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-1.5 flex items-center"><CalendarDays className="mr-2 h-4 w-4" />Release Date</h4>
                    <p className="text-foreground">{new Date(game.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimateOnScroll>
        </div>
      </div>

      {otherGames.length > 0 && (
        <section className="mt-16 md:mt-24 pt-8 border-t border-border">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-foreground text-center mb-8">More Games You Might Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {otherGames.map((otherGame, index) => (
              <AnimateOnScroll
                key={otherGame.id}
                animationClass="animate-slide-up-fade-in"
                delay={`delay-${index * 100}ms`}
                className="h-full"
              >
                <GameCard game={otherGame} />
              </AnimateOnScroll>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


export default function GameDetailPage({ params: paramsPromise }: { params: Promise<{ gameId: string }> }) {
  const resolvedParams = use(paramsPromise);
  const gameId = resolvedParams.gameId;

  const [game, setGame] = useState<Game | undefined | null>(undefined);
  const [otherGames, setOtherGames] = useState<Game[]>([]);

  useEffect(() => {
    async function loadData() {
      const fetchedGame = await getGameById(gameId);
      if (!fetchedGame) {
        setGame(null);
        return;
      }
      setGame(fetchedGame);
      const fetchedOtherGames = await getOtherGames(gameId);
      setOtherGames(fetchedOtherGames);
    }
    loadData();
  }, [gameId]);

  if (game === undefined) {
    return <GameDetailPageLoadingFallback />;
  }

  if (game === null) {
    notFound();
  }

  return <GameDetailPageContent game={game} otherGames={otherGames} />;
}


export function GameDetailPageLoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 md:pt-32">
      <div className="mb-6">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-6 w-24" /> <Skeleton className="h-6 w-28" />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8">
          <div className="flex gap-4 border-b mb-6">
            <Skeleton className="h-10 w-24" /> <Skeleton className="h-10 w-24" /> <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="aspect-video w-full rounded-lg mb-4" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="aspect-video w-24 h-auto rounded" />
            <Skeleton className="aspect-video w-24 h-auto rounded" />
            <Skeleton className="aspect-video w-24 h-auto rounded" />
          </div>
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6 mb-4" />
           <Skeleton className="h-6 w-1/3 my-4" />
           <Skeleton className="h-4 w-full mb-1" />
           <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="aspect-[2/1] w-full max-w-xs mx-auto lg:mx-0 rounded" />
          <Card className="p-4">
            <Skeleton className="h-5 w-1/4 mb-2" />
            <div className="flex items-baseline gap-2 mb-1">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full" />
          </Card>
          <Card className="p-4">
             <Skeleton className="h-6 w-1/2 mb-3" />
             <Skeleton className="h-4 w-1/3 mb-1" />
             <Skeleton className="h-5 w-3/4 mb-3" />
             <Skeleton className="h-4 w-1/3 mb-1" />
             <Skeleton className="h-5 w-3/4 mb-3" />
             <Skeleton className="h-4 w-1/3 mb-1" />
             <Skeleton className="h-5 w-3/4" />
          </Card>
        </div>
      </div>

      <div className="mt-16 md:mt-24 pt-8 border-t">
        <Skeleton className="h-8 w-1/2 mx-auto mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-[4/3] rounded-lg" />)}
        </div>
      </div>
    </div>
  );
}

