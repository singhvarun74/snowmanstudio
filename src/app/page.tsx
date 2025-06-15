
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';
import FeaturedGames from '@/components/sections/home/featured-games';
import PageTitle from '@/components/ui/page-title';
import { Instagram, Youtube } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/snowman-homepage.png" 
            alt="Snowman Studio homepage hero image featuring a snowman"
            data-ai-hint="snowman homepage"
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

      {/* Latest Buzz Section - Updated */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <PageTitle title="Latest Buzz" />
           <AnimateOnScroll>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Stay connected with us on social media for the latest updates, behind-the-scenes content, and community interactions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:opacity-90 hover:scale-105 transition-all duration-150 ease-out shadow-lg hover:shadow-xl">
                <Link href="https://www.instagram.com/thesnowmanstudio/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-5 w-5" />
                  Follow on Instagram
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white hover:scale-105 transition-transform duration-150 ease-out shadow-lg hover:shadow-xl">
                <Link href="https://www.youtube.com/@thesnowmanstudio" target="_blank" rel="noopener noreferrer">
                  <Youtube className="mr-2 h-5 w-5" />
                  Subscribe on YouTube
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
