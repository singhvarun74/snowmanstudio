"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import { ExternalLink } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  imageUrl: string;
  imageHint: string;
  itchioEmbedUrl?: string; 
  itchioPageUrl: string; 
  description: string;
}

const games: Game[] = [
  {
    id: '1',
    title: 'Glacial Guardians',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'fantasy strategy game',
    itchioPageUrl: 'https://itch.io', 
    description: "Command powerful guardians in this epic strategy game set in a frozen realm. Master tactical combat and defend your kingdom from ancient evils.",
  },
  {
    id: '2',
    title: 'Frostbite Frontier',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'survival adventure game',
    itchioPageUrl: 'https://itch.io',
    description: "Brave the harsh wilderness in this thrilling survival adventure. Gather resources, build shelter, and uncover the secrets of a land trapped in eternal winter.",
  },
  {
    id: '3',
    title: 'Arctic Ascent',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'platformer game winter',
    itchioPageUrl: 'https://itch.io',
    description: "Embark on a perilous journey up a colossal ice mountain in this challenging platformer. Precision and quick reflexes are key to reaching the summit.",
  },
];

export default function FeaturedGames() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game, index) => (
          <AnimateOnScroll
            key={game.id}
            animationClass="animate-slide-up-fade-in"
            delay={`delay-${index * 100}ms`}
            className="h-full"
          >
            <div 
              onClick={() => handleCardClick(game)}
              className="group relative rounded-lg overflow-hidden shadow-xl cursor-pointer aspect-[4/3] h-full flex flex-col"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(game);}}
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
          </AnimateOnScroll>
        ))}
      </div>

      {selectedGame && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
      )}
    </>
  );
}
