
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageTitle from '@/components/ui/page-title';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import { GameCard, type Game } from '@/components/sections/home/featured-games';
import { ExternalLink, ListChecks, Tags, Gamepad2, CalendarDays, Film, GalleryHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

async function getGameById(id: string): Promise<Game | undefined> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/data/games.json`);
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

async function getOtherGames(currentId: string, count: number = 3): Promise<Game[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/data/games.json`);
     if (!response.ok) {
      console.error(`Failed to fetch games.json for other games: ${response.status}`);
      return [];
    }
    const games: Game[] = await response.json();
    return games.filter(game => game.id !== currentId && game.showInFeaturedGrid).slice(0, count);
  } catch (error) {
    console.error("Error fetching or parsing games.json for other games:", error);
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/data/games.json`);
    if (!response.ok) {
      return [];
    }
    const games: Game[] = await response.json();
    return games.map((game) => ({
      gameId: game.id,
    }));
  } catch (error) {
    console.error("Error fetching games for generateStaticParams:", error);
    return [];
  }
}

interface GamePageProps {
  params: {
    gameId: string;
  };
}

export default async function GameDetailPage({ params }: GamePageProps) {
  const game = await getGameById(params.gameId);

  if (!game) {
    notFound();
  }

  const otherGames = await getOtherGames(params.gameId);

  return (
    <div className="container mx-auto px-4 py-16 pt-32 md:pt-40">
      <AnimateOnScroll animationClass="animate-fade-in-from-bottom">
        <PageTitle title={game.title} className="text-center !mb-2" />
        {game.heroTagline && (
          <p className="text-center text-xl text-muted-foreground mb-10">{game.heroTagline}</p>
        )}
      </AnimateOnScroll>

      <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-2xl mb-12 border-2 border-card">
        {game.itchioEmbedUrl ? (
            <iframe
                src={game.itchioEmbedUrl}
                frameBorder="0"
                className="w-full h-full"
                allowFullScreen
                title={`${game.title} Itch.io Embed`}
            />
        ) : (
            <Image
                src={game.imageUrl}
                alt={game.title}
                data-ai-hint={game.imageHint}
                fill
                style={{objectFit:"cover"}}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
            />
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16">
        {/* Main Content Column */}
        <AnimateOnScroll animationClass="animate-fade-in-from-bottom" delay="delay-100ms" className="md:col-span-2 space-y-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Full Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {game.description}
              </p>
            </CardContent>
          </Card>

          {game.keyFeatures && game.keyFeatures.length > 0 && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center">
                  <ListChecks className="mr-2 h-6 w-6" /> Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  {game.keyFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </AnimateOnScroll>

        {/* Sidebar / Info Column */}
        <AnimateOnScroll animationClass="animate-fade-in-from-bottom" delay="delay-200ms" className="md:col-span-1">
          <Card className="shadow-xl sticky top-24"> {/* Added sticky top for better UX on scroll */}
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Game Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {game.genres && game.genres.length > 0 && (
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-2 flex items-center"><Tags className="mr-2 h-4 w-4" />Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {game.genres.map(genre => <Badge key={genre} variant="secondary">{genre}</Badge>)}
                  </div>
                </div>
              )}
              {game.platforms && game.platforms.length > 0 && (
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-2 flex items-center"><Gamepad2 className="mr-2 h-4 w-4" />Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.map(platform => <Badge key={platform} variant="secondary">{platform}</Badge>)}
                  </div>
                </div>
              )}
              {game.releaseDate && (
                <div>
                  <h4 className="font-semibold text-muted-foreground mb-2 flex items-center"><CalendarDays className="mr-2 h-4 w-4" />Release Date</h4>
                  <p className="text-foreground">{new Date(game.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              )}
              <Separator className="my-4" />
              <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-opacity-80 py-3 text-lg group transition-all duration-150 ease-out hover:scale-105 shadow-md">
                <a href={game.itchioPageUrl} target="_blank" rel="noopener noreferrer">
                  Play on Itch.io
                  <ExternalLink className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </AnimateOnScroll>
      </div>
      
      {game.trailerUrl && (
        <section className="mb-16">
          <AnimateOnScroll animationClass="animate-fade-in-from-bottom">
            <PageTitle title="Watch the Trailer" subtitle="Get a glimpse of the action!" className="text-center" />
            <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl border-2 border-card">
              <iframe
                src={game.trailerUrl}
                title={`${game.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </AnimateOnScroll>
        </section>
      )}

      {game.galleryImages && game.galleryImages.length > 0 && (
        <section className="mb-16">
          <AnimateOnScroll animationClass="animate-fade-in-from-bottom">
            <PageTitle title="Gallery" subtitle="More sights from the game" className="text-center" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {game.galleryImages.map((image, index) => (
                <AnimateOnScroll 
                  key={index} 
                  animationClass="animate-slide-up-fade-in" 
                  delay={`delay-${index * 100}ms`}
                  className="relative aspect-video rounded-lg overflow-hidden shadow-lg border border-card group"
                >
                  <Image 
                    src={image.src} 
                    alt={image.alt || `${game.title} Screenshot ${index + 1}`} 
                    data-ai-hint={image.imageHint}
                    fill 
                    style={{objectFit:"cover"}}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </AnimateOnScroll>
              ))}
            </div>
          </AnimateOnScroll>
        </section>
      )}


      {otherGames.length > 0 && (
        <section>
          <PageTitle title="More Games You Might Like" className="text-center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

export function GameDetailPageLoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-16 pt-32 md:pt-40">
      <Skeleton className="h-12 w-3/4 mx-auto mb-4 md:w-1/2" />
      <Skeleton className="h-8 w-1/2 mx-auto mb-10 md:w-1/3" />

      <Skeleton className="aspect-video w-full rounded-lg mb-12" />

      <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
           <Card>
            <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
           <Card className="sticky top-24">
            <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-1/2 mb-2" />
              <div className="flex flex-wrap gap-2"><Skeleton className="h-6 w-16" /><Skeleton className="h-6 w-20" /></div>
              <Skeleton className="h-6 w-1/2 mb-2 mt-2" />
              <div className="flex flex-wrap gap-2"><Skeleton className="h-6 w-12" /><Skeleton className="h-6 w-24" /></div>
              <Skeleton className="h-6 w-1/2 mb-2 mt-2" />
              <Skeleton className="h-5 w-3/4" />
              <Separator className="my-4" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Skeleton className="h-10 w-1/2 mx-auto mb-8 md:w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-video rounded-lg" />)}
      </div>


      <Skeleton className="h-10 w-1/2 mx-auto mb-8 md:w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] h-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

