
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import FeaturedGames from '@/components/sections/home/featured-games';
import PageTitle from '@/components/ui/page-title';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="\snowman-homepage.png" // Changed to local path
            alt="Snowman Studio hero image with snowman"
            data-ai-hint="snowman horror"
            fill
            style={{objectFit:"cover"}}
            quality={85}
            priority
          />
          <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
        </div>
        <AnimateOnScroll
          animationClass="animate-fade-in-from-bottom"
          className="relative z-10 p-4"
          delay="delay-200ms"
        >
          {/* Headline and tagline removed as per request */}
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-opacity-80 hover:scale-105 transition-transform duration-150 ease-out shadow-lg hover:shadow-xl px-10 py-3 text-lg font-semibold">
            <Link href="/games">Explore Our Worlds</Link>
          </Button>
        </AnimateOnScroll>
      </section>

      {/* Featured Games Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <PageTitle title="Featured Games" className="text-center" />
          <FeaturedGames />
        </div>
      </section>

      {/* Brief About Us Snippet */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <PageTitle title="Who We Are" className="text-primary" />
          <AnimateOnScroll>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Snowman Studio is a passionate team of developers, artists, and storytellers dedicated to creating unforgettable gaming experiences. We believe in the power of play to inspire, connect, and entertain.
            </p>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 ease-out hover:scale-105 shadow-md">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Latest News Teaser */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <PageTitle title="Latest Buzz" />
           <AnimateOnScroll>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Stay up to date with our latest announcements, game updates, and behind-the-scenes peeks.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-opacity-80 hover:scale-105 transition-transform duration-150 ease-out shadow-lg hover:shadow-xl">
              <Link href="/news">Read All News</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
